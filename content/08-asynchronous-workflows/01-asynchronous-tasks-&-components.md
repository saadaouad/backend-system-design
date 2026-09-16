# Asynchronous Tasks & Components

**Async** means you do not wait for the response to continue. Set it and forget it. Here is a job. Assume it will be done at some point. Let me know when it is done.

That is the whole idea. The caller starts the work and moves on. The expensive part is no longer on the request path.

```text
Synchronous                         Asynchronous
Client ── wait ──► work ──► Client  Client ── job ──► queue
                                    Client ◄── "started"
                                    ...later...
                                    Worker does the work
```

## Why asynchronicity

Asynchronicity does two useful things:

* It **takes computationally expensive tasks off the hot path**. They are no longer the bottleneck for the request.
* It **keeps the system responsive** while those tasks run.

You do not sit on the connection until the video is encoded or the report is finished. You say: we started it. It will finish. Come back, or we will tell you, when it is done.

This shows up in system design. It also shows up in everyday programming. JavaScript and Node do this all the time. The **event loop** starts async work, keeps turning, and picks the result up when it is ready. The rest of the call stack does not stall on that one slow thing.

The same idea, at the system level, is a job on a queue and a worker that will get to it.

## Expensive tasks

These are the jobs you do not want on a synchronous request:

* Uploading and processing a large video file
* Generating a report
* Processing payments
* Image resizing or thumbnail creation

A user can wait 200ms for "upload received." They should not wait minutes for "thumbnail ready" on the same HTTP call.

## How the pieces fit

The request server does not do the heavy work. It hands a **job** to a broker. Workers pull jobs when they have capacity.

<img src="/assets/asynchronous-tasks.png" alt="A server sends a job to a message broker with queues, then workers pull jobs and do the work" style="max-width:100%; height:auto;" />

Left to right:

1. The **server** accepts the user request and creates a job. It does not process the video or the report itself.
2. The job goes into a **message broker**. Inside the broker, **queues** hold jobs until someone is free.
3. **Workers** sit on the other side. They pull a job, do the work, and become free for the next one.

The server can return immediately. The queues absorb bursts. Adding workers increases how much work you can finish at once, without making the API slower.

If every worker is busy, jobs wait in the queue. That is the point. Waiting in a queue is better than making the user wait on the original request.

## Components

Three roles show up in that picture.

| Component            | Job                                                              |
| -------------------- | ---------------------------------------------------------------- |
| **Message broker**   | Routes and manages messages and the queues they sit in           |
| **Message queue**    | Holds messages (jobs) until a worker is ready to process them    |
| **Workers**          | Pull jobs from a queue and perform the work                      |

The broker is the traffic cop. The queue is the waiting room. The worker is the one who actually does the expensive task.

These names overlap in real products. Some tools are a broker with queues built in. Some are a queue you talk to directly. The roles stay the same.

### Examples

| Role                    | Examples                         |
| ----------------------- | -------------------------------- |
| **Message brokers**     | Kafka, RabbitMQ                  |
| **Message queues**      | RabbitMQ, Amazon SQS             |
| **Worker management**   | Kubernetes                       |

RabbitMQ appears twice on purpose. It is a broker that also gives you queues. Kafka is a log you consume. SQS is a managed queue. Kubernetes does not process jobs itself. It runs and scales the worker processes that do.

## Summary

Async is set it and forget it. Start the job. Do not block the request. Get notified when it is done.

Use it for work that is slow: video, reports, payments, images. Put a broker and queues between the server and the workers so expensive tasks stop being the bottleneck, and the API stays responsive.
