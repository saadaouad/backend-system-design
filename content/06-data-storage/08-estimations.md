# Estimations

Estimations **ground vague requirements in reality**. "A lot of users" is not a number. "100,000 users, 3 tasks a day, 500 bytes a task" is.

They also force you to think about **specific components**. Storage, requests, and users are different questions. Each one points at a different part of the system.

In an interview, the point is not a perfect answer. It is to **show your thought process**. Write the assumptions down. Do the math out loud. Check that the result is in the right ballpark.

The numbers do **not** have to be precise. Order of magnitude is enough: megabytes or gigabytes, thousands or millions of requests.

```text
Vague requirement
        │
        ▼
Clarify what to estimate
        │
        ▼
Assumptions (written down)
        │
        ▼
Do the math
        │
        ▼
Sanity check
```

## Strategy

### 1. Clarify

**What are you estimating?** Pick a target. Common ones:

* **Users** — how many people, how many of them are active
* **Requests** — reads, writes, peak QPS
* **Storage** — how big a table, a log, a backup gets

**Ask, or make reasonable assumptions.** How many users? How often do they act? How big is one record? If nobody gives you the numbers, choose round ones and say them out loud.

**Validate your assumptions.** Write them down. A number that lives only in your head is easy to drop a zero on.

### 2. Do the math

Use easy numbers. Prefer 10, 30, 100, 1,000. Keep units visible: users × actions × days × bytes.

Work in steps. Count the items first. Then convert to storage or to requests per second.

### 3. Sanity check your results

Does the result feel right?

* Too small: you probably dropped a zero, or counted one user instead of all of them.
* Too big: you may have counted every day as peak, or stored the same data twice.
* Compare to something you know: a photo is a few MB, a row of text is hundreds of bytes, a busy API is thousands of QPS.

If it fails the sniff test, go back to the assumptions. Do not defend a number that cannot be true.

## Example

**How big will our tasks table get in a month if we have 100,000 users and a task is 500 bytes?**

### Assumptions

* 100,000 users
* 3 tasks per user per day
* 30 days in a month
* 500 bytes per task

Write those down before touching a calculator.

### Calculations

Tasks per month:

```text
3 tasks/day × 30 days × 100,000 users
= 9,000,000 tasks
```

Storage:

```text
9,000,000 tasks × 500 bytes
= 4,500,000,000 bytes
```

Convert to GB (1 GB = 1,000,000,000 bytes):

```text
4,500,000,000 / 1,000,000,000
= 4.5 GB per month
```

### Sanity check

100,000 users × about 100 tasks each in a month is 10 million rows. 10 million × 500 bytes is about 5 GB. **4.5 GB** is the right order of magnitude.

45 MB would be wrong. That is what you get if you estimate 1,000 users instead of 100,000. The math was easy. The zero was not. That is why the check exists.

This number is good enough to design against. It tells you the table is small for one month, and that a year of tasks is still tens of gigabytes, not petabytes. You do not need a more precise byte count than that.

## Summary

| Step            | What to do                                              |
| --------------- | ------------------------------------------------------- |
| **Clarify**     | Users, requests, or storage? Write the assumptions down. |
| **Do the math** | Round numbers, visible units, one step at a time.       |
| **Sanity check**| Right order of magnitude? If not, find the dropped zero. |

Estimations are not about being exact. They are about turning a vague requirement into a number you can design with, and showing how you got there.
