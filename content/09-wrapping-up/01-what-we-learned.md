# What We Learned

This is a wrap-up, not a new topic. The goal was never a catalog of every database or protocol. It was a way to think.

## What we learned

* **How to approach system design step-by-step.** Scope first. Model entities. Design APIs. Then choose storage, scaling, and communication. Do not start with a stack.
* **CAP theorem and system quality.** Consistency, availability, and partition tolerance cannot all be maxed at once. Reliability, availability, performance, and resilience are requirements, not decorations.
* **Practical skills.** Estimation, async workflows, replication, caching, partitioning, TLS termination, authentication vs authorization, and more. Numbers, queues, and copies are how vague requirements become a design.

```text
Scope
  → Model
  → APIs
  → Scale, store, secure, go async
  → Trade-offs, not perfect systems
```

There is no perfect system. There is a system whose trade-offs match the problem.

Start simple. Write the assumptions down. Keep expensive work off the request path. Know who the user is, and what they are allowed to do. Copy data when a single machine is not enough.

That is the work.
