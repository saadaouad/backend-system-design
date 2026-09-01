# Load Balancers

A simple system often looks like this: one client, one server, and one database.

That setup can handle something like **1,000 users** without much trouble.

```text
Client
   │
   ▼
Server
   │
   ▼
Database
```

Now imagine the same app needs to support **100,000 users**.

The usual next step is **horizontal scaling**: add more servers.

```text
Client
   │
   ▼
Server 1    Server 2    Server 3
```

That creates a new problem.

## The Problem With Multiple Servers

With one server, the client always knows where to connect. DNS points to a single machine, and the request path is simple.

With several servers, the client has to answer questions such as:

* Which server should I talk to?
* What if one server is offline?
* How do we keep DNS and IP addresses up to date as we add or remove machines?

Without something in the middle, scaling out becomes hard very quickly. Clients would need to know about every server, and taking a server down would break traffic.

This is the problem a **load balancer** solves.

## What a Load Balancer Does

A **load balancer** sits between clients and servers. Clients talk to the load balancer. The load balancer forwards each request to a healthy server.

```text
Client
   │
   ▼
Load Balancer
   │
   ├──► Server 1
   ├──► Server 2
   └──► Server 3
      │
      ▼
   Database
```

This makes it easy to **scale up and scale down**. We can add or remove servers behind the load balancer without changing how the client connects.

If one server goes offline, the load balancer can stop sending traffic to it.

## What Else a Load Balancer Can Do

A load balancer is not only a traffic splitter. It can also:

* Terminate **HTTPS**
* Inspect and route requests based on the path
* Run **health checks** and take unhealthy servers out of rotation

At this point, we are often talking about a **reverse proxy**.

## Load Balancer vs Reverse Proxy

A reverse proxy can sit in front of servers, forward requests, and often **do load balancing** as well.

Tried-and-true reverse proxies such as **Nginx** can handle TLS termination, routing, health checks, and load balancing.

For very high traffic, a dedicated load balancer is often a better fit. An example is **Amazon Elastic Load Balancing (ELB)**, which is built to distribute traffic at scale.

In practice there is a lot of overlap:

* A reverse proxy can load balance
* A load balancer can do some reverse-proxy work

They are not the same thing, but they are closely related.

## In System Design

In a system design discussion, it is usually enough to say **load balancer** and assume it is doing this extra work: distributing traffic, checking health, and sitting in front of a pool of servers.

If someone asks for more detail, we can be more precise:

> This is actually a reverse proxy that is also doing load balancing.

The important idea is simple: **once there is more than one server, clients should talk to a load balancer, not to each server directly**.
