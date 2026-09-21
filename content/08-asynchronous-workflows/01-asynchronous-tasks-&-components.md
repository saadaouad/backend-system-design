# Asynchronous Tasks & Components

**Async** means you do not have to wait for the response to continue. Set it and forget it. Here is a job. Assume it will be done at some point. Let me know when it is done.

## Asynchronicity

Asynchronicity:

* Helps with **computationally expensive tasks**
* Keeps the system **responsive** even when those tasks run for a long time

You do not wait for the work to finish. You set it and forget it.

In system design, and in programming, that means expensive work is no longer the bottleneck. You start a task. You assume it will get done. You do not sit around for it.

Node does this well. The **event loop** starts async work and keeps going. When the work finishes, Node picks it up and continues the rest of the call stack. The same idea at the system level: start a job, move on, hear back later.

## Expensive tasks

These are the jobs you do not want to wait on:

* Uploading and processing a large video file
* Generating a report
* Processing payments
* Image resizing or thumbnail creation

The API can say "we started it." It should not stay open until the video is processed or the thumbnail exists.

## How the work is handed off

The server does not do the heavy work itself. It sends a **job**. A broker holds that job. Workers pull it when they are ready.

<img src="/assets/asynchronous-tasks.png" alt="A server sends a job to a message broker with queues. Workers then pull jobs and do the work." style="max-width:100%; height:auto;" />

Left to right in the diagram:

1. The **server** creates a job and sends it on.
2. The **message broker** receives it. Inside the broker, **queues** hold jobs until a worker is free.
3. **Workers** pull jobs from the queues and perform the work.

The server can forget the job after it is queued. If workers are busy, the job waits in the queue. That is better than making the original request wait.

## Components

| Component            | Role                                                              |
| -------------------- | ----------------------------------------------------------------- |
| **Message broker**   | Routes and manages messages and message queues                    |
| **Message queue**    | Holds messages (jobs) until a worker is ready to process them     |
| **Workers**          | Pull jobs from a queue and perform the work                       |

The broker routes. The queue holds. The worker does the expensive task.

### Examples

| Role                    | Examples                         |
| ----------------------- | -------------------------------- |
| **Message brokers**     | Kafka, RabbitMQ                  |
| **Message queues**      | RabbitMQ, Amazon SQS             |
| **Worker management**   | Kubernetes                       |

RabbitMQ is both a broker and a source of queues. Kafka is a broker. SQS is a managed queue. Kubernetes does not run the jobs. It runs and scales the workers that do.

## Summary

Async is set it and forget it. Start the job. Do not wait. Get told when it is done.

That is how expensive work (video, reports, payments, images) stays off the request path. A broker and queues sit between the server and the workers so the system stays responsive.
