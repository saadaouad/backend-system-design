# Data Storage Overview

> At the end of the day, most of what you do is reading from and writing to a database.

That is true, but it is easy to over-index on databases. For most systems, a few key patterns are enough. You do not need to know every database.

Unless you are in a deep, domain-specific problem that needs several kinds of storage, knowing the **high-level options** and the **top databases for a given problem** is usually enough. Follow your instincts. We will look at relational databases, non-relational databases, and a handful of storage types. That is most of what you need.

## Start Simple

Use the **simplest solution** that works. You can always scale up later.

The thing that is hard to change later is the **schema**, especially in a relational database. Get that right at the beginning.

```text
Simple store
     ↓
Clear schema
     ↓
Scale later if needed
```

## Think in the Domain

When choosing storage, start from the domain:

* What is the system doing?
* What type of data are we moving around?
* Is the data structured or unstructured?

The database should follow the shape of the problem, not the other way around.

## Structured vs Unstructured Data

**Structured data** has a clear shape and clear relationships, similar to objects in object-oriented programming.

Relational databases are a good fit here. Tables relate to each other the same way objects relate to each other.

```text
User
  │
  ├── Orders
  │     │
  │     └── Products
  │
  └── Address
```

**Unstructured data** is looser. A common example is a JSON blob. Some fields may overlap, but the shape is not strict.

This is where non-relational databases often fit better.

|                | Structured                         | Unstructured                    |
| -------------- | ---------------------------------- | ------------------------------- |
| **Shape**      | Fixed schema and relations         | Flexible, often a document      |
| **Example**    | Users, orders, products            | JSON blobs, events, logs        |
| **Typical fit** | Relational databases (SQL)        | Document or other NoSQL stores  |

## Dimensions to Consider

Beyond the data shape, a few other dimensions help us choose storage.

### Persistent vs Ephemeral

**Persistent** data must survive restarts, crashes, and deploys. Account records, orders, and documents usually belong here.

**Ephemeral** data is temporary. Caches, sessions, and short-lived job state often belong here.

```text
Persistent:  write → store → still there later
Ephemeral:  write → useful for a while → can disappear
```

### Read-Optimized vs Write-Optimized

Some systems read far more than they write. A product catalog or a news feed is often **read-optimized**.

Other systems write constantly. Logging, metrics, and event ingestion are often **write-optimized**.

The storage engine, indexes, and data model should match which side matters more.

### Consistency vs Availability

This is the same trade-off we see in distributed systems.

* **Consistency:** readers should see the latest correct data.
* **Availability:** the system should keep responding even when parts of it fail.

A bank transfer usually leans toward consistency. A social media like count can often lean toward availability.

## Summary

| Question                         | Why it matters                                      |
| -------------------------------- | --------------------------------------------------- |
| Structured or unstructured?      | Points toward SQL or NoSQL                          |
| Persistent or ephemeral?         | Database vs cache or temporary store                |
| Read-heavy or write-heavy?       | Indexes, engine, and data model                     |
| Consistent or highly available?  | Replication and database choice                     |

Do not try to know every database. Know the patterns, pick a simple option that fits the domain, and be careful with the schema when you use a relational database.
