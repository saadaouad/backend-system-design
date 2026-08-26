# Protocols

After modeling the entities and APIs, we need to decide **how components communicate**.

A protocol defines the rules for sending and receiving data between clients, servers, and services.

The protocol we choose affects latency, scalability, browser support, and how the API is consumed.

## 1. HTTP

**HTTP** is a request-response protocol. The client sends a request, and the server sends back a response.

```text
Client  ────── request ──────►  Server
Client  ◄──── response ──────  Server
```

### Key Characteristics

* Simple
* Human readable
* Supported by all browsers
* Stateless

### Common Use Cases

* Web browsers
* Standard web APIs

## 2. WebSockets

**WebSockets** keep a connection open so the client and the server can send messages to each other at any time.

```text
Client  ◄────── messages ──────►  Server
        (persistent connection)
```

### Key Characteristics

* Bi-directional communication
* Persistent connection
* Low latency
* Stateful

### Common Use Cases

* Chat applications
* Live dashboards
* Collaborative editing

## 3. Server-Sent Events

**Server-Sent Events (SSE)** allow the server to push updates to the client over a long-lived HTTP connection.

The client does not send messages back over the same stream. Communication is one-way: server to client.

```text
Client  ────── subscribe ──────►  Server
Client  ◄──── event stream ────  Server
```

### Key Characteristics

* One-way communication (server to client)
* Human readable

### Common Use Cases

* News feeds
* Status updates
* Stock tickers

## 4. gRPC

**gRPC** is a high-performance RPC framework. It typically runs over HTTP/2 and uses **Protocol Buffers** to define strongly typed contracts.

```text
Service A  ────── binary RPC ──────►  Service B
```

### Key Characteristics

* Binary protocol (HTTP/2)
* Strongly typed contracts (Protocol Buffers)
* Requires code generation

### Common Use Cases

* Microservice communication
* Performance-critical systems
* IoT devices

## 5. REST

**REST** is an API style, usually built on HTTP. Resources are exposed through multiple endpoints, and clients interact with them using standard HTTP methods.

```text
POST   /users
GET    /users/:id
POST   /orders
GET    /orders/:id
```

### Key Characteristics

* Multiple endpoints
* Human readable
* Supported by all browsers
* Stateless

### Common Use Cases

* Single sources of data
* CRUD apps
* Easily cached data

## 6. GraphQL

**GraphQL** is an API style that usually exposes a **single endpoint**. The client asks for exactly the data it needs.

```text
POST   /graphql

{
  user(id: "1") {
    name
    orders {
      total
    }
  }
}
```

### Key Characteristics

* Single endpoint
* Precise data retrieval
* Self-documenting API
* Strongly typed

### Common Use Cases

* Complex or multiple sources of data (for example, a homepage that aggregates many services)
* Apps supporting multiple client types
* Decoupling frontend from backend development

## Summary

| Protocol / Style     | Communication                         | Best suited for                         |
| -------------------- | ------------------------------------- | --------------------------------------- |
| **HTTP**             | Request-response                      | Web browsers and standard APIs          |
| **WebSockets**       | Bi-directional, persistent            | Chat, live dashboards, collaboration    |
| **Server-Sent Events** | One-way, server to client           | Feeds, status updates, tickers          |
| **gRPC**             | Binary RPC over HTTP/2                | Microservices and high-performance APIs |
| **REST**             | Multiple resource endpoints           | CRUD apps and cacheable data            |
| **GraphQL**          | Single endpoint, client-defined data  | Complex data from multiple sources      |

The important part is not to use every protocol, but to choose the one that matches **how the system needs to communicate**.

## Quick cheat sheet

<img src="/assets/protocols-cheat-sheet.png" alt="Protocol cheat sheet" style="max-width:100%; height:auto;" />
