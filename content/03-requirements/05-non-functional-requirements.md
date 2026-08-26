# Non-Functional Requirements

**Non-functional requirements** describe how well a system needs to work rather than what the system needs to do.

They help us understand the expected **scale, performance, consistency, and security** of the system.

Before designing the architecture, we should answer a few important questions.

## 1. How Many Users Do We Expect?

We need to understand the expected number of users and traffic.

Questions to ask:

* How many users do we expect?
* How many requests per second (RPS) do we expect?
* Does traffic change over time?
* Are there peak hours or seasonal spikes?

For example:

```text
Normal traffic:   1,000 RPS
Peak traffic:    10,000 RPS
```

This information helps us decide how much capacity the system needs and whether we need mechanisms such as load balancing, caching, or horizontal scaling.

## 2. How Consistent Does the System Need to Be?

We need to understand how quickly data needs to become consistent across the system.

Ask:

> Is it acceptable for users to see slightly outdated data?

For example, showing a social media follower count that is a few seconds old may be acceptable.

However, showing an incorrect bank account balance may not be acceptable.

This requirement can influence our choice between **strong consistency** and **eventual consistency**.

## 3. What Metrics Are Important?

We need to define how we will measure whether the system is performing well.

Important metrics can include:

* Latency
* Throughput
* Error rate
* Availability
* RPS
* CPU and memory usage

For example:

> What is the maximum acceptable latency?

```text
API request
    │
    ▼
Response
    │
    └── Must respond within 200 ms
```

Defining these targets helps us make better architectural decisions.

## 4. What Data Needs to Be Protected?

We need to identify which data is sensitive and how it should be protected.

Examples include:

* Personal information
* Passwords
* Payment information
* Authentication tokens
* Private documents
* Business data

This affects decisions around:

* Authentication
* Authorization
* Encryption
* Data storage
* Network security
* Access control

## Why Non-Functional Requirements Matter

Two systems can provide exactly the same functionality but require completely different architectures because their non-functional requirements are different.

For example:

> **System A:** 100 users, 10 RPS, 1-second latency is acceptable.

> **System B:** 10 million users, 100,000 RPS, 100 ms latency, high availability, and strict security requirements.

Both systems may have the same core functionality, but **their architecture, infrastructure, and technology choices will be very different**.

Non-functional requirements therefore give us the constraints we need to design the right system.
