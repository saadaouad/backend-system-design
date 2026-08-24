# System Quality

When designing a system, it is not enough to make it work. We also need to think about **how well the system works**.

System quality describes the characteristics that determine whether a system is reliable, secure, scalable, observable, and able to perform well as requirements change.

## 1. Reliability

**Reliability** is the ability of a system to function correctly over time.

It includes:

* **Availability:** How often the system is operational and accessible.
* **Resiliency:** How well the system handles failures and recovers from them.
* **Consistency:** How well the system keeps data correct and consistent.

## 2. Observability

**Observability** is the ability to understand what is happening inside a system by looking at its outputs.

It helps us answer questions such as:

* Is the system working correctly?
* Where is a request failing?
* Why is the system slow?
* Which component is causing problems?

Common observability tools include:

* Logs
* Metrics
* Traces
* Alerts

## 3. Security

**Security** is the ability to protect the system and its data from unauthorized access, misuse, and attacks.

It includes:

* Authentication
* Authorization
* Encryption
* Data protection
* Secure communication

## 4. Scalability

**Scalability** is the ability of a system to handle increases or decreases in usage.

For example, a system might need to handle:

```text
1,000 users
      ↓
10,000 users
      ↓
1,000,000 users
```

A scalable system can grow without requiring a complete redesign.

## 5. Adaptability

**Adaptability** is the ability of a system to handle changing requirements, business needs, or user behavior.

For example, a system should ideally be able to support:

* New features
* New types of users
* Changing business rules
* Changes in traffic patterns

A system that is easy to change is generally easier to maintain over time.

## 6. Performance

**Performance** describes how efficiently a system processes requests and handles data.

Two important measurements are:

### Latency

**Latency** is how quickly the system responds to a request.

```text
Request ───────────────→ Response
          ← Latency →
```

For example:

> An API responds in 100 ms.

Lower latency generally means faster responses.

### Throughput

**Throughput** is how much work or data a system can process in a given amount of time.

For example:

> An API can handle 10,000 requests per second.

So, in simple terms:

* **Latency:** How fast is one request?
* **Throughput:** How much work can the system handle?

## Summary

When designing a system, we should consider all of these qualities together:

| Quality           | Main Question                          |
| ----------------- | -------------------------------------- |
| **Reliability**   | Does it keep working correctly?        |
| **Observability** | Can we understand what is happening?   |
| **Security**      | Is the system and its data protected?  |
| **Scalability**   | Can it handle changes in usage?        |
| **Adaptability**  | Can it handle changing requirements?   |
| **Performance**   | How fast and efficiently does it work? |

There is rarely a single system that maximizes every quality. Improving one quality can sometimes negatively affect another, so **system design is about balancing these qualities based on the requirements and priorities of the system**.
