# Caching Tradeoffs & Invalidation

A cache is a copy. Copies get old. The work of caching is not only putting data in. It is deciding **when that copy is no longer good enough**, and **what to throw out** when the cache is full.

## Performance vs freshness

This is the trade-off.

**Performance** wants the cache to hit as often as possible. Keep entries around. Serve them fast. Do not go back to the database.

**Freshness** wants the cache to match the source of truth. Drop or update entries as soon as the real data changes.

```text
More caching                         More freshness
┌────────────────────┐               ┌────────────────────┐
│ High hit rate      │               │ Up-to-date data    │
│ Low latency        │               │ More origin reads  │
│ Stale data risk    │               │ More cache misses  │
└────────────────────┘               └────────────────────┘
```

A product catalog can be a few seconds behind. A bank balance usually cannot. The right point on this line is a **requirement**, not a default.

A long-lived cache is fast and cheap. It is also wrong for longer. A short-lived cache is fresher. It misses more, so the origin works harder.

Invalidation and eviction are how you pick a point on that line.

## Cache invalidation

**Invalidation** marks an entry as no longer valid. The next read has to fetch a fresh copy.

There are four common ways to do it.

### Time-based expiration (TTL)

Give every entry a **time to live**. When the timer runs out, the entry expires.

```text
set(key, value, TTL = 60s)
        │
        ▼
   served from cache
        │
        ▼
   60s later → gone
   next read → miss → load from DB
```

TTL is simple. You do not need to know when the data changed. You only need to know how stale it is allowed to be.

The cost is obvious. Until the TTL ends, readers can see old data. After it ends, the next request pays for a miss, even if nothing changed.

Use a short TTL when freshness matters. Use a longer one when the data barely moves.

### Event-based

Invalidate when **something happens**. A user updates a profile. A price changes. An order is placed. That event deletes or rewrites the matching cache keys.

```text
Write to database
        │
        ▼
   emit event  →  invalidate those keys
```

The cache stays close to the source of truth. You only drop what actually changed.

The cost is coupling. You have to know which keys belong to which event. Miss a key, and that copy stays stale until something else evicts it.

### Version tagging

Put a **version** on the data, in the key or as a tag.

```text
user:42:v3     ← current
user:42:v2     ← old, ignored
```

When the data changes, bump the version. New reads use the new key. Old keys are left behind and die by TTL or eviction.

This is useful when many entries belong together. Bump one version, and the whole set is effectively invalid, without deleting each key by hand.

The cost is extra bookkeeping. You have to store and read the current version, and you will have a window where old and new keys both exist.

### Refresh ahead

Do not wait for a miss. **Refresh the entry before it expires**, while it is still being served.

```text
TTL = 60s
        │
        ▼
   at ~50s, refresh from DB in the background
        │
        ▼
   users keep hitting the cache
   nobody waits on a miss
```

Readers stay fast. The cache stays warm. The origin is hit on a schedule, not on a stampede when a hot key expires.

The cost is extra work: you refresh keys that might not be requested again. Use it for hot keys, not for everything.

## Cache eviction

**Eviction** is different from invalidation. Invalidation says "this copy is wrong." Eviction says "the cache is full, something has to go."

A cache has a size limit. When a new entry arrives and there is no room, the eviction policy picks a victim.

### FIFO

**First in, first out.** The oldest entry by insertion time leaves first.

Simple. Fair in arrival order. Blind to whether that old entry is still the hottest key in the system.

### LIFO

**Last in, first out.** The newest entry leaves first.

The cache behaves like a stack. Recent inserts are the first to go. This is unusual for a general cache. It can make sense when the newest items are one-time scans you do not want to keep.

### LRU

**Least recently used.** The entry that has gone the longest without a read is evicted.

```text
Access A, then B, then C, then A again
Victim: B   (C is newer, A was just used)
```

This is the default in most caches. If nobody has asked for it lately, it is probably safe to drop.

### MRU

**Most recently used.** The entry that was just used is evicted.

That sounds backwards until the access pattern is a scan. You read a large range once. Those keys will not be needed again soon. Evicting the one you just used keeps the older working set in place.

### LFU

**Least frequently used.** The entry with the fewest hits is evicted.

A key that is read all day stays. A key that was read once leaves. This protects long-lived hot data better than LRU, which can forget a popular key after a quiet stretch.

The cost is counters. You have to track how often each key is used, and early misses can look "cold" just because they are new.

### RR

**Random replacement.** Pick a victim at random.

No recency. No frequency. No ordered list. It is cheap to run and hard to game. Hit rate is usually worse than LRU or LFU, but the policy itself has almost no overhead.

## Comparison

| Invalidation         | When the copy dies                         | Best when                                      |
| -------------------- | ------------------------------------------ | ---------------------------------------------- |
| **TTL**              | After a fixed time                         | You can name an acceptable lag                 |
| **Event-based**      | When a write or domain event happens       | You know which keys that event touches         |
| **Version tagging**  | When the version bumps                     | Many keys should fall together                 |
| **Refresh ahead**    | It does not die; it is reloaded early      | Hot keys that must not miss                    |

| Eviction | Victim                         | Typical fit                                      |
| -------- | ------------------------------ | ------------------------------------------------ |
| **FIFO** | Oldest insert                  | Simple queues of entries                         |
| **LIFO** | Newest insert                  | One-time scans you do not want to keep           |
| **LRU**  | Least recently accessed        | General-purpose caches                           |
| **MRU**  | Most recently accessed         | Sequential scans, looping over a large set       |
| **LFU**  | Least often accessed           | Stable hot keys over a long window               |
| **RR**   | Random                         | Tiny caches, or when bookkeeping is too expensive |

## Summary

Performance and freshness pull in opposite directions. Invalidation decides when a copy is too old. Eviction decides what leaves when the cache is full.

TTL is the simple default. Events and versions are more precise. Refresh ahead keeps hot keys from ever missing.

LRU is the eviction policy you will see most. The others exist for access patterns that LRU gets wrong.
