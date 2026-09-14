# Caching

Caching is a form of **data storage**. That is why this section is called data storage, not database.

You are not doing complex queries on a cache. A cache should be **fast**. That is why a cache is usually a **key-value** store: look up a key, get a value, done.

Caching is about storing frequently accessed data **as close as you can** to the thing that needs it.

A cache on the client is the dream. Put data as close to the user as possible. You can also cache at every other layer: the browser, the API, the database, and the network.

```text
Closest to the user                  Farther away
┌────────┐   ┌─────┐   ┌─────────┐   ┌──────────┐
│ Client │ → │ CDN │ → │   API   │ → │ Database │
│ cache  │   │     │   │  cache  │   │  cache   │
└────────┘   └─────┘   └─────────┘   └──────────┘
```

## Always Be Caching

Cache when you can. It:

* **Reduces latency.** The data is already nearby.
* **Improves user experience.** Pages and APIs feel faster.
* **Decreases system load.** The database and origin servers do less work.
* **Lowers costs.** Fewer expensive reads and less compute.

The trade-off is freshness. A cache can serve data that is slightly old. That is usually worth it for data that is read often and does not have to be exact to the millisecond.

## Cache examples

Caching shows up at every layer. The data is different at each one, but the idea is the same: keep a fast copy close to the reader.


| Layer           | Examples                         | Types of data                                      |
| --------------- | -------------------------------- | -------------------------------------------------- |
| **Browser**     | Local storage, HTTP cache        | User preferences, responses, HTML, JS, CSS         |
| **API service** | In-memory cache, disk cache      | Computed results, API responses                    |
| **Database**    | Query cache, buffer pool         | Frequently read data, indexes, query results       |
| **CDN**         | Fastly, Akamai, Open Connect     | Static assets                                      |

The browser is closest to the user. A CDN is still close, just shared across many users. An API cache sits next to the application. A database cache sits next to the source of truth. Use all of them when they help. Do not wait for one perfect layer.

## Cache-aside (lazy loading)

**Cache-aside** is the pattern the application drives. The app talks to the cache and to the database. The cache does not load itself.

On a **read**:

1. Look in the cache. On a **cache miss**, the data is not there.
2. Read from the database.
3. Update the cache, so the next read is a hit.

```text
Read (cache-aside)
App → Cache     miss
App → Database  read
App → Cache     write the result
```

On a **write**:

1. Write to the database.
2. Write to the cache.

```text
Write (cache-aside)
App → Database  write
App → Cache     write
```

The database stays the source of truth. The cache is filled when something is actually requested (lazy loading) and updated when something is written. If the cache is empty, the system still works. It is just slower until the cache warms up.

The risk is a **stale cache**: a write that updates the database but misses the cache, or two writers racing. Keep the write path simple, and expire entries so they cannot live forever.

## Write-through

The application writes to the cache first. The cache then writes to the database.

1. Write to the cache.
2. Write to the database.

```text
Write-through
App → Cache → Database
```

The cache and the database stay in sync on every write. Reads can trust the cache more. The cost is write latency: the caller waits for both stores.

## Read-through

The application reads from the cache. On a miss, the cache (or a cache library in front of the database) loads the data.

1. Read from the cache.
2. On a miss, read from the database.
3. Write to the cache.

```text
Read-through
App → Cache     hit  → return
         │
         └── miss → Database → write to cache → return
```

This looks like cache-aside on a read. The difference is **who** fills the cache. In cache-aside, the application does it. In read-through, the cache layer does it. The application only talks to the cache.

## Write-behind

The application writes to the cache and returns immediately. The database is updated later.

1. Write to the cache.
2. Immediately return.
3. Asynchronously write to the database.

```text
Write-behind
App → Cache → return
         └── (later) → Database
```

Writes feel fast. The cache absorbs bursts. The risk is clear: if the cache dies before the async write finishes, that data is gone. Use this when write latency matters more than immediately durable storage, and when you can replay or accept some loss.

## Comparison

| Pattern              | Who talks to the DB                         | Write path                         | Read path                          | Main risk                         |
| -------------------- | ------------------------------------------- | ---------------------------------- | ---------------------------------- | --------------------------------- |
| **Cache-aside**      | The application                             | DB, then cache                     | Miss → DB → fill cache             | Stale or missing cache entries    |
| **Write-through**    | The cache, on every write                   | Cache, then DB                     | Cache (usually warm)               | Slower writes                     |
| **Read-through**     | The cache, on a miss                        | (often paired with write-through)  | Cache, miss loads from DB          | Cache layer becomes a dependency  |
| **Write-behind**     | The cache, later, in the background         | Cache, return, then async DB       | Cache                              | Lost writes if the cache fails    |

## Summary

A cache is fast, close, key-value storage. Put it as near the reader as you can, and at more than one layer.

Cache-aside lets the application fill and update the cache. Write-through and read-through hide the database behind the cache. Write-behind makes writes fast by delaying the database.

Always be caching. Just remember that a cache is a copy, not the source of truth.
