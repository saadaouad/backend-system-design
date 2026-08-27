# Protocol Scenarios

Knowing the characteristics of each protocol is useful, but the important skill is choosing the right one for a real system.

These case studies look at a requirement and decide which protocol fits best.

## 1. Stock Trading Dashboard

> A stock trading dashboard showing real-time price updates.

**Choice: Server-Sent Events**

Prices flow in one direction: from the server to the client. The dashboard does not need to send messages back over the same connection.

```text
Market data
     │
     ▼
Server  ────── price updates ──────►  Dashboard
```

SSE is a good fit because it is simple, human readable, and designed for one-way live updates such as tickers and feeds.

## 2. Collaborative Document Editor

> A document editor where multiple users collaborate simultaneously.

**Choice: WebSockets**

Users need to see each other's changes immediately. Edits, cursors, and presence updates must travel in both directions with low latency.

```text
User A  ◄────── changes ──────►  Server  ◄────── changes ──────►  User B
```

WebSockets keep a persistent, bi-directional connection, which is what collaborative editing needs.

## 3. Food Delivery Driver Location

> A food delivery app that needs to show the delivery driver's location.

**Choice: HTTP long polling**

The client asks the server for the latest location. If there is no new data yet, the server holds the request open until an update is available, or until the request times out. The client then sends another request.

```text
App  ────── request (held open) ──────►  Server
App  ◄──── driver location ────────────  Server
App  ────── request again ────────────►  Server
```

Long polling is useful when updates are needed, but a full WebSocket connection may be more than the system requires. Driver location updates are periodic rather than a continuous two-way conversation.

## 4. Banking API for Multiple Clients

> An API for a banking system used by multiple client applications.

**Choice: REST**

Mobile apps, web apps, and internal tools all need a clear, stable way to create, read, and update resources such as accounts, transfers, and statements.

```text
Mobile app  ──┐
Web app     ──┼── REST API ──►  Banking system
Internal tool ┘
```

REST works well here because it is stateless, widely supported, cacheable, and easy for many client types to consume over HTTP.

## 5. Video Processing Microservices

> Communication between microservices in a video processing pipeline.

**Choice: gRPC**

Services in the pipeline call each other internally. They need low latency, strongly typed contracts, and efficient binary payloads.

```text
Upload  ──►  Transcode  ──►  Thumbnail  ──►  Storage
         gRPC          gRPC           gRPC
```

gRPC is a strong fit for internal service-to-service communication, especially in performance-critical pipelines.

## Summary

| Scenario                         | Need                              | Protocol              |
| -------------------------------- | --------------------------------- | --------------------- |
| Stock trading dashboard          | One-way real-time updates         | Server-Sent Events    |
| Collaborative document editor    | Bi-directional real-time updates  | WebSockets            |
| Food delivery driver location    | Periodic location updates         | HTTP long polling     |
| Banking API for multiple clients | Stable CRUD API over HTTP         | REST                  |
| Video processing microservices   | Fast internal service calls       | gRPC                  |

The protocol should follow the communication pattern of the system: one-way updates, two-way collaboration, request-response APIs, or internal service calls.
