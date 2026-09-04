# Relational Databases

One kind of storage is going to be **stricter** than the other. That is a useful way to choose.

If the system needs a **strict, consistent** data storage scheme, use a relational database.

If the system just needs some storage and the shape is still unclear, a non-relational store is often enough. Switching later is not free, and it is not always easy, but it is usually less painful than changing a relational schema after a year of work.

## Schema Cost

Relational databases are strict. Tables, columns, and relationships are defined up front.

That is the point. It is also the risk.

If the schema is wrong, the cost of fixing it is high. A year of tables can still miss a column, or model the wrong relationships. That defeats the purpose of using a relational store in the first place.

Migrations exist. They are not cheap.

```text
Get the schema right early
         ↓
Cheap to query, expensive to change
```

## Scaling

Non-relational databases usually **horizontally scale** well. In many cases they do it automatically.

Relational databases do not scale out automatically. Someone has to decide how to scale them. We will come back to that later.

## What They Are

Relational databases are **SQL** stores with:

* Structured data with relationships
* An enforced schema
* ACID transactions

They excel when the data has a **clear relationship** to other data.

## Relationships

Take a pizza shop.

A customer wants a pizza. The link between them is an **order**.

Every order has a `customer_id` and a `pizza_id`. That is the relationship.

```text
Customer                Pizza
    │                     │
    │    customer_id      │
    └────────► Order ◄────┘
               pizza_id
```

The benefit of strong relationships is **complex queries that stay fast**. The data is structured, so searching and querying can be efficient.

A document store such as MongoDB is different. The data is unstructured, so a query often has to go field by field. That is slower.

## Indexing

An **index** is a shortcut. Instead of scanning the entire database, the database knows where to look.

```text
Without index:  scan every row
With index:     go straight to the matching rows
```

Most relational databases, such as Postgres, already do a lot of this in the background. They index and optimize without the application having to manage every detail.

That is what structured data buys: the ability to express and query **complex relationships** efficiently.

Can a NoSQL database do that too? Yes. It is just not the default strength of that model.

## ACID

Structured relational databases are **ACID** compliant.

| Property         | Meaning                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| **Atomicity**    | Each transaction is all-or-nothing. Every operation succeeds, or none do. |
| **Consistency**  | Transactions always follow the rules set for the database.              |
| **Isolation**    | Concurrent transactions do not interfere with each other. Each runs as if it were alone. |
| **Durability**   | Once a transaction is saved, its changes are permanent.                 |

## Summary

|                  | Relational databases                         |
| ---------------- | -------------------------------------------- |
| **Language**     | SQL                                          |
| **Data**         | Structured, with relationships               |
| **Schema**       | Enforced, expensive to change later          |
| **Queries**      | Fast complex queries over related data       |
| **Transactions** | ACID                                         |
| **Scaling**      | Does not horizontally scale automatically    |

Use a relational database when the data has a clear shape and clear relationships, and when consistency matters more than easy schema changes.
