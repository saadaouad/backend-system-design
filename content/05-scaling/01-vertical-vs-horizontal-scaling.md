# Vertical vs Horizontal Scaling

Once a system is running, we eventually need to ask: **how do we scale it?**

Scale can mean different things:

* More users
* More requests
* Lower latency
* More data

The two main ways to scale a system are **vertical scaling** and **horizontal scaling**.

```text
Vertical scaling          Horizontal scaling
(scale up)                (scale out)

     ┌─────────┐              ┌────┐  ┌────┐  ┌────┐
     │         │              │    │  │    │  │    │
     │  BIG    │              │ M1 │  │ M2 │  │ M3 │
     │ SERVER  │              │    │  │    │  │    │
     │         │              └────┘  └────┘  └────┘
     └─────────┘
```

## Vertical Scaling

**Vertical scaling** (also called scaling up) increases performance by adding more power to a single machine.

That can mean:

* More CPU
* More RAM
* More GPU
* More disk space

The server itself becomes more powerful.

### Why People Start Here

Vertical scaling is often the first response when a system is slow or running at peak load.

It is easy:

* No code changes are required
* The application stays on one machine
* Cloud providers make it simple to upgrade instance size

If the system is struggling, making the server bigger is usually the fastest thing to try.

### Limits

There are limits to vertical scaling:

* Hardware has physical limits
* Larger machines become expensive
* Scaling up and down can be costly
* A single machine is still a single point of failure, so resiliency decreases

Vertical scaling is useful, but it is not enough on its own when the system needs to grow a lot.

## Horizontal Scaling

**Horizontal scaling** (also called scaling out) increases performance by adding more machines.

Instead of one bigger server, we run many servers side by side.

```text
Requests
    │
    ▼
Load Balancer
    │
    ├──► Server 1
    ├──► Server 2
    └──► Server 3
```

This is how most systems scale in practice.

### The Trade-off

Horizontal scaling is not a free lunch.

Someone has to operate all of those machines. That means orchestration, coordination, and more moving parts.

The system can become harder to run because we now have to think about:

* Load balancing
* Service discovery
* Shared state
* Failures across machines
* Distributed coordination tools such as ZooKeeper or distributed messaging systems

There are entire software systems whose job is to manage the complexity of distributed systems.

The default in system design is often "just scale horizontally." That may be the right choice, but it should be a conscious one. Horizontal scaling adds complexity.

## Comparison

### Vertical Scaling

**Definition:** Increase performance by adding more power (CPU, RAM, GPU, disk) to a machine.

**Pros:**

* Simple to implement
* No code changes required
* Easier maintenance

**Cons:**

* Physical limits of hardware
* Expensive to scale up and down
* Decreased resiliency

### Horizontal Scaling

**Definition:** Increase performance by adding more machines.

**Pros:**

* Easily scales up and down with traffic
* High availability
* Increased fault tolerance

**Cons:**

* Requires orchestration
* Can require code changes
* Adds operational complexity

## Summary

|                 | Vertical scaling        | Horizontal scaling          |
| --------------- | ----------------------- | --------------------------- |
| **Approach**    | Bigger machine          | More machines               |
| **Also called** | Scale up                | Scale out                   |
| **Main benefit** | Simple                | Real scale and resilience   |
| **Main cost**   | Hardware limits         | Complexity                  |

Vertical scaling is more power and better components on a bigger server. Horizontal scaling is more machines.

Both have a place. The goal is to choose the approach that matches the scale we actually need, without adding more complexity than the system requires.
