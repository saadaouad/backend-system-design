# Availability, Primary, Replica & Snapshots

A single database is a single point of failure. If that machine dies, the system stops. **Availability** is the question of what happens when things go wrong.

The usual answer is **replication**: keep copies of the data on more than one server.

## Availability

Availability is the proportion of time the system stays up and reachable.

A lone database can be fast and consistent. It cannot survive a crash, a disk failure, or a data-center outage. Replication is how storage stays available when a node fails.

```text
One database                    Replicated databases
┌──────────┐                    ┌──────────┐  ┌──────────┐
│   data   │                    │   data   │  │   copy   │
└──────────┘                    └──────────┘  └──────────┘
  crash = down                    crash = still serving
```

## Replication

**Replication** is making copies of data across multiple servers or locations.

It does two useful things:

* **Fault tolerance.** If one copy is lost, another copy still has the data.
* **Read performance.** Reads can be spread across copies instead of hitting one machine.

Writes are the hard part. Someone has to decide which servers accept writes, and how those writes reach the other copies. That is what the topologies below are about.

## Primary / Replica

One server is the **primary**. The others are **replicas**.

1. All writes go to the primary.
2. Replicas copy data from the primary and handle reads.
3. If the primary fails, a replica can take over.

<img src="/assets/primary-replica.png" alt="Primary / Replica: writes go to the primary, replicas serve reads" style="max-width:100%; height:auto;" />

This is the most common setup. It is simple: there is one source of truth for writes, so conflicts are rare. Reads scale by adding replicas. The cost is that replicas can lag behind the primary, so a read might see slightly stale data. Writes are still limited by the capacity of one primary.

If the primary dies, a replica is promoted. Until that happens, writes stop.

## Primary / Primary

More than one server is a primary. Each of them accepts **reads and writes**. The copies stay in sync with each other.

1. Multiple servers accept writes and reads.
2. Data is synchronized between all servers.

<img src="/assets/primary-primary.png" alt="Primary / Primary: every primary accepts reads and writes, and they sync with each other" style="max-width:100%; height:auto;" />

This removes the single write bottleneck. An app in one region can write to a nearby primary instead of shipping every write across the world.

The cost is coordination. Two primaries can write the same row at the same time. Those writes have to be reconciled. Availability goes up. Conflict handling becomes part of the design.

## Peer to Peer

There is no primary. Every server is an equal **peer**.

1. Every server can read and write.
2. Changes are shared with all other servers.

<img src="/assets/peer-to-peer.png" alt="Peer to peer: every node reads, writes, and shares changes with the others" style="max-width:100%; height:auto;" />

This is the most decentralized model. Any node can take a request. If one peer fails, the others keep going. There is no failover step because there is no special node to fail over from.

The trade-off is the same as primary/primary, only larger. Every write has to fan out. Conflicts are expected. Systems that use this model usually accept **eventual consistency** and pick a strategy for merging competing writes.

## Strategies

Copies have to stay in agreement. Three common strategies:

### Transactional

Each change is replicated as a **transaction**. A write is applied on the source, then the same operations are applied on the copies, in order.

Replicas stay close to the source. This is a good fit when the copies should look like the primary almost all the time, and when the write path can wait for that to happen.

The cost is coupling. If a replica is slow or down, transactional replication can stall or fall behind.

### Snapshot

A **snapshot** is a point-in-time copy of the data.

Instead of shipping every write, the system periodically takes a picture of the dataset and sends that picture to the other servers. Snapshots are also how backups and disaster-recovery copies are usually made.

This is simple and cheap to reason about. The copies are only as fresh as the last snapshot. Use it when some lag is acceptable: reporting, analytics, or a cold standby.

### Merge

Both sides can change the same data. Later, the copies **merge**.

When two nodes write the same row, the system has to decide what the result is: last write wins, a custom merge rule, or a conflict left for the application to resolve.

Merge is the strategy that matches primary/primary and peer-to-peer. It buys availability. It spends consistency.

## Comparison

|                    | Primary / Replica              | Primary / Primary                    | Peer to Peer                         |
| ------------------ | ------------------------------ | ------------------------------------ | ------------------------------------ |
| **Writes**         | One primary                    | Several primaries                    | Every node                           |
| **Reads**          | Replicas (and the primary)     | Any primary                          | Any peer                             |
| **Failover**       | Promote a replica              | Other primaries keep writing         | Other peers keep writing             |
| **Conflicts**      | Rare                           | Possible                             | Expected                             |
| **Typical fit**    | Read-heavy, one source of truth | Active-active, multi-region writes  | Highly available, eventually consistent |

| Strategy           | How copies stay in sync                         | Best when                                      |
| ------------------ | ----------------------------------------------- | ---------------------------------------------- |
| **Transactional**  | Replicate each change in order                  | Copies should stay close to the source         |
| **Snapshot**       | Periodic point-in-time copy                     | Some lag is fine, or you need a backup         |
| **Merge**          | Both sides write, then reconcile                | Multiple writers, availability over freshness  |

## Summary

Availability asks what happens when a server fails. Replication answers by keeping copies.

Primary/replica keeps writes on one server and spreads reads. Primary/primary and peer-to-peer let more than one server accept writes, at the cost of conflicts.

Transactional replication keeps copies close. Snapshots are simpler and laggier. Merge is how multi-writer systems stay available when two copies disagree.
