# Strategy

Once we understand the requirements, the next step is to define a **strategy** for designing the system.

A good system design strategy can be broken down into three main steps:

## 1. Scope the Problem

First, clearly define what we are building and what is outside the scope.

We need to identify:

* The main users
* Core use cases
* Functional requirements
* Non-functional requirements
* Constraints
* Expected scale

The goal is to avoid solving problems that are not relevant to the system.

## 2. Design the High-Level Architecture

Once the problem is scoped, define the main components and how they interact.

For example:

```text
Client
   │
   ▼
Load Balancer
   │
   ▼
API Servers
   │
   ├── Cache
   ├── Database
   └── Message Queue
          │
          ▼
        Worker
```

At this stage, focus on the **big picture** rather than implementation details.

## 3. Address Key Challenges and Trade-offs

Finally, identify the most important challenges the system will face and decide how to handle them.

Typical questions include:

* How will the system scale?
* What happens when a component fails?
* How do we handle high traffic?
* How do we keep data consistent?
* Where should we use caching?
* Which operations should be asynchronous?
* What are the main security concerns?

Every solution has trade-offs. The goal is to identify them and choose the approach that best fits the requirements.

### The Overall Strategy

```text
Scope the Problem
       ↓
High-Level Architecture
       ↓
Challenges & Trade-offs
       ↓
Detailed Design
```

The key idea is to **start broad, understand the problem, design the major building blocks, and then progressively go deeper into the details**.
