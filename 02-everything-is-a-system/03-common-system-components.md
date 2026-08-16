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

The goal is not to use every component, but to understand **what problem each component solves and when it is useful**.
