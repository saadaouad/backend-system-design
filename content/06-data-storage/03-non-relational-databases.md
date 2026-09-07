# Non-Relational Databases

Non-relational databases (often called **NoSQL**) are the looser option.

The schema is flexible. The data does not have to fit a fixed set of tables and relationships. That makes them a good default when the shape of the data is still unclear, or when the system needs to **horizontally scale** without a lot of manual work.

There are several kinds. The four common ones are document, key-value, column, and graph.

## Document

A **document** store keeps data as flexible, structured documents, usually JSON.

Each document can have its own fields. Two documents in the same collection do not have to look the same.

```text
{
  "id": "u1",
  "name": "Alex",
  "orders": [101, 102]
}

{
  "id": "u2",
  "name": "Sam",
  "email": "sam@example.com"
}
```

This is a common fit for unstructured or semi-structured data: profiles, events, logs, and anything whose shape may change.

## Key-Value

A **key-value** store keeps data as simple pairs: a unique key and its value.

Lookups are by key. That is the whole model.

```text
key                  value
─────────────────────────────
session:abc123  →    { userId, expiresAt }
user:42         →    { name, email }
cache:home      →    <html>...
```

This is simple and fast. Caches, sessions, and feature flags often live here.

## Column

A **column** store organizes data into **columns** instead of rows.

The point is fast retrieval of similar data. If a query only needs one field across many records, the database can read that column without loading the rest of the row.

```text
Row store                         Column store

id | name | city                  id:     1, 2, 3
1  | Ana  | Paris                 name:   Ana, Ben, Cam
2  | Ben  | Lyon                  city:   Paris, Lyon, Nice
3  | Cam  | Nice
```

This is a common fit for analytics, metrics, and other read patterns that scan the same fields over a large dataset.

## Graph

A **graph** store keeps data as **nodes** and **relationships**.

The connections are first-class. Querying them is the point of the model, not an afterthought.

```text
(Alex) ──friends──► (Sam)
  │                   │
  └──works_at──► (Acme) ◄──works_at──┘
```

This is a good fit when the system is really about connections: social graphs, recommendations, org charts, and dependency maps.

## Summary

| Type           | What it stores                                      | Strength                         |
| -------------- | --------------------------------------------------- | -------------------------------- |
| **Document**   | Flexible documents, often JSON                      | Schema can vary per record       |
| **Key-value**  | A unique key and its value                          | Simple, fast lookups             |
| **Column**     | Data grouped by column, not by row                  | Fast reads of similar fields     |
| **Graph**      | Nodes and relationships                             | Querying connections             |

Pick the type that matches the shape of the data. Document and key-value cover most day-to-day cases. Column and graph show up when the access pattern is more specific.
