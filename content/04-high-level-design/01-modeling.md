# Modeling

Once the requirements are clear, we can start designing the system at a high level.

The goal at this stage is to understand the main building blocks of the system and how they interact, without getting into implementation details.

A simple way to approach high-level design is:

```text
Requirements
     ↓
Entity Modeling
     ↓
API Design
     ↓
Endpoints (optional)
```

### 1. Entity Modeling

**Entity modeling** is about identifying the main functional elements of the system.

We ask:

* What are the main entities?
* What information does each entity contain?
* How are the entities related?

For example, for a simple e-commerce system:

```text
User
  │
  ├── Orders
  │     │
  │     └── Products
  │
  └── Address
```

The goal is to understand the main concepts of the system before thinking about the implementation.

### 2. API Design

Once we understand the entities, we can define the **actions and operations** that the system needs to support.

For example:

* Create a user
* Get a user
* Create an order
* Get an order
* Add a product to an order

These operations can later be exposed through APIs.

### 3. Endpoints

Once the API operations are defined, we can optionally map them to concrete endpoints.

For example:

```text
POST   /users
GET    /users/:id

POST   /orders
GET    /orders/:id

POST   /orders/:id/products
```

Endpoints are an implementation detail. The important part at the high-level design stage is first understanding **what the system needs to do**, then defining the operations that support those requirements.
