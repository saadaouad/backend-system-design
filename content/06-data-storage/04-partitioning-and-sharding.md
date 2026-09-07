# Partitioning and Sharding

This is a tricky topic. The question is: **how do you slice your data?**

Relational databases do not horizontally scale by adding machines. Someone has to decide how the data is split. That is what partitioning and sharding are.

Slicing the data does not automatically throw ACID away. It depends **where** the slices live.

```text
One database server              Several database servers
┌─────────────────────┐          ┌──────┐  ┌──────┐  ┌──────┐
│  partition A        │          │shard1│  │shard2│  │shard3│
│  partition B        │          └──────┘  └──────┘  └──────┘
│  partition C        │
└─────────────────────┘
     Partitioning                      Sharding
```

## Partitioning

**Partitioning** splits a table into smaller pieces that still live on **one server**.

Use it when:

* The data still fits on one server
* You need transactional guarantees
* Queries need to span multiple tables

The database is still one system. Joins, foreign keys, and ACID transactions keep working.

### Example: orders by year

A pizza shop keeps all orders in one `orders` table. After a few years the table is huge. Most queries only care about recent orders.

Partition the table by year, still on one Postgres:

```text
                    orders
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   orders_2024   orders_2025   orders_2026
```

A query for "orders this month" only reads `orders_2026`. Old partitions stay available for history, but they are not scanned every time.

The application still talks to one database. An order can join to `customers` and `pizzas` in the same transaction. That is the point of partitioning: smaller pieces, same server, same guarantees.

### How the slices are chosen

Common ways to pick a partition:

| Strategy     | Rule                         | Example                         |
| ------------ | ---------------------------- | ------------------------------- |
| **Range**    | Values in a range            | Orders by year, users by id     |
| **List**     | Values in a named set        | Region = EU, US, APAC           |
| **Hash**     | `hash(key) % N`              | Spread users evenly             |

Range is easy to reason about. Hash is better when one range would be much hotter than the others.

## Sharding

**Sharding** splits data across **multiple servers**. Each shard is its own database.

This is how a relational database is scaled out. It is not automatic. You choose a **shard key**, and that key decides which server owns a row.

```text
Requests
    │
    ▼
Router (shard key)
    │
    ├──► Server 1  users 0–1M
    ├──► Server 2  users 1M–2M
    └──► Server 3  users 2M–3M
```

### Example: customers by id

The pizza shop now has more customers than one database can hold.

Shard by `customer_id`:

```text
customer_id % 3 == 0  →  shard A
customer_id % 3 == 1  →  shard B
customer_id % 3 == 2  →  shard C
```

Looking up one customer is fast. You hash the id, go to one shard, done.

The cost shows up when a query or a transaction needs more than one shard.

* "This customer's last 10 orders" is easy if orders live on the same shard as the customer.
* "All orders in Paris last week" may have to hit every shard, then merge the results.
* Moving money, or any write that touches two customers on different shards, is no longer a normal ACID transaction. Each shard is consistent on its own. Across shards, you have to design around that.

That is the trade-off. Sharding buys machines. It sells the simplicity of one database.

### What makes a good shard key

The shard key should:

* Put related rows on the same shard (a customer and that customer's orders)
* Spread load so one shard is not much hotter than the others
* Be available on almost every query, so the router knows where to go

A bad key creates hotspots or forces most queries to fan out to every server.

## Partitioning vs Sharding

|                    | Partitioning                         | Sharding                                      |
| ------------------ | ------------------------------------ | --------------------------------------------- |
| **Where data lives** | One server                         | Several servers                               |
| **Goal**           | Smaller tables, faster local access  | Scale beyond one machine                      |
| **Transactions**   | Still ACID across the data           | ACID inside a shard, hard across shards       |
| **Joins**          | Queries can span multiple tables     | Cross-shard joins are slow or avoided         |
| **Who decides**    | Usually the database                 | You, via a shard key                          |

## Summary

Partitioning slices a table on **one** server. Use it when the data still fits, and you need transactions and joins.

Sharding slices data across **many** servers. Use it when one machine is no longer enough. Pick the shard key so related data stays together, or every query becomes a scatter-gather problem.
