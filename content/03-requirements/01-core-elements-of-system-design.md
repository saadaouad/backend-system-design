# Core elements of system design

Before designing a system, we need to understand **what the system is supposed to do and why**.

System design starts with requirements. They help us understand the problem, define what the system needs to achieve, and guide our architectural decisions.

There are three core elements of system design:

## 1. Translating Business Requirements

The first step is to understand the **business problem** and translate it into technical requirements.

We need to ask:

* What problem are we solving?
* Who are the users?
* What does the system need to do?
* What are the most important features?
* What are the constraints?

For example:

> "Users should be able to upload videos."

This business requirement can be translated into technical requirements:

* Users can upload video files.
* The system needs to store the videos.
* Large files should be processed asynchronously.
* Users should be able to see the processing status.
* Videos should be available for playback after processing.

The goal is to turn a high-level business requirement into something that can be **designed and implemented**.

## 2. Designing the API and Architecture

Once we understand the requirements, we can start designing the **API and system architecture**.

We need to decide:

* What APIs do we need?
* What components are required?
* How will components communicate?
* Where will data be stored?
* Which operations should be synchronous or asynchronous?
* How will the system scale?

For example:

```text
Client
   │
   ▼
API
   │
   ├── Database
   │
   ├── Cache
   │
   └── Queue → Worker
```

The architecture should directly support the requirements rather than being driven by technology choices.

## 3. Understanding Technology and Trade-offs

There is rarely a single correct solution in system design.

Different technologies and architectural approaches come with different **advantages and disadvantages**.

For example:

* SQL vs NoSQL
* REST vs GraphQL
* Synchronous vs asynchronous processing
* Monolith vs microservices
* Strong consistency vs eventual consistency
* Local cache vs distributed cache

The important question is not:

> "What is the best technology?"

Instead, ask:

> **"What is the best choice for our requirements and constraints?"**

Every decision involves trade-offs between things such as:

* Performance
* Scalability
* Reliability
* Complexity
* Cost
* Consistency
* Maintainability

Good system design is therefore not about choosing the most advanced technology. It is about **making informed decisions based on the requirements and understanding the trade-offs behind those decisions**.
