## 3. Common System Components

Most backend systems are built from a few common components. Each component has a specific role and works together with the others to form the complete system.

| Component         | Role                                                                            |
| ----------------- | ------------------------------------------------------------------------------- |
| Client            | Sends requests and displays data to users                                       |
| Server            | Processes requests and handles business logic                                   |
| Database          | Stores, updates, and retrieves data                                             |
| Load Balancer     | Distributes incoming traffic across servers to keep the system running smoothly 
| Cache             | Makes things faster by temporarily storing frequently accessed data             |

These components can be combined in different ways depending on the requirements of the system.

A simple backend system might look like this:

```text
Client
   │
   ▼
Load Balancer
   │
   ├──────────┐
   ▼          ▼
Server 1    Server 2
   │          │
   └────┬─────┘
        │
   ┌────┴────┐
   ▼         ▼
Cache    Database
```

## Client

The **client** is the part of the system that users interact with. It sends requests to the server and displays the results.

<img src="/assets/client.png" alt="Client" style="max-width:50%; height:auto;" />

---

## Server

The **server** processes requests and contains the business logic of the application. It can also communicate with databases, other servers, and external services.

<img src="/assets/server.png" alt="Server" style="max-width:50%; height:auto;" />

---

## Load Balancer

A **load balancer** distributes incoming traffic across multiple servers. This helps prevent a single server from becoming overloaded and improves availability and scalability.

<img src="/assets/load-balancer.png" alt="Load balancer" style="max-width:50%; height:auto;" />

---

## Database

A **database** stores and manages the data used by an application. It allows the system to create, update, retrieve, and delete data.

<img src="/assets/database.png" alt="Database" style="max-width:50%; height:auto;" />

---

## Cache

A **cache** temporarily stores frequently accessed data so it can be retrieved faster than accessing the original data source.

Caching can reduce latency and decrease the load on servers and databases.

<img src="/assets/cache.png" alt="Cache" style="max-width:50%; height:auto;" />

The main idea is simple: **store data closer to where it is needed so it can be accessed faster.**

---

The goal is not to use every component, but to understand **what problem each component solves and when it is useful**.
