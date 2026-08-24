# CAP Theorem

Before discussing the CAP Theorem, it is useful to understand a few related concepts.

* **Reliability:** The ability of a system to function correctly over time.
* **Availability:** The proportion of time a system is operational and accessible.
* **Resiliency:** How well a system handles failures and recovers from them.
* **Consistency:** How well a system ensures that users see the same data.

## The CAP Theorem

The **CAP Theorem** states that a distributed system cannot guarantee all three of the following properties at the same time:

### 1. Consistency

Every read receives the **most recent write** or an error.

In other words, users see the same, up-to-date data.

### 2. Availability

Every request receives a **non-error response**, even if the system cannot return the most recent data.

The system remains responsive.

### 3. Partition Tolerance

The system continues to operate even when there are **network failures**, such as messages being delayed or lost between components.

```text id="zj1vqw"
             CAP
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
 Consistency Availability Partition
                    Tolerance
```

In a distributed system, network partitions can happen. Therefore, when a partition occurs, we generally have to choose between **Consistency** and **Availability**.

## Trade-offs

| Choice    | Trade-off                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| **C + A** | Can provide both consistency and availability when there is no network partition, but cannot tolerate partitions. |
| **C + P** | Maintains consistent, up-to-date data during a partition, but may reject or delay requests.                       |
| **A + P** | Continues responding during a partition, but responses may contain outdated data.                                 |

### A Simple Example

Imagine a banking system with two servers:

```text
        User
         │
    ┌────┴────┐
    ▼         ▼
 Server A   Server B
    │         │
    └────┬────┘
       Database
```

If the network connection between the servers fails, the system has to make a choice.

**Consistency:**
Stop accepting some requests until the servers can communicate again, ensuring users don't see conflicting data.

**Availability:**
Continue accepting requests, even if some users temporarily see older data.

Neither choice is universally better. It depends on the **requirements of the system**.

## Takeaways

* In distributed systems, **network failures will happen**.
* When a network partition occurs, you often have to decide: **is it more important to have the latest data or to always remain available?**
* There is no **"perfect" system**.
* System design is about understanding **trade-offs** and choosing what matters most for the specific requirements.
