# Authentication vs Authorization

These two words get mixed up. They are not the same job.

**Authentication** verifies identity. It answers: **who are you?**

**Authorization** determines permissions. It answers: **what can you do?**

```text
Request
   │
   ▼
Authentication     Who are you?
   │
   ▼
Authorization      What can you do?
   │
   ▼
Do the work        POST /createTask
```

You authenticate first. A known user who is not allowed to create a task still gets rejected. An unknown caller never gets as far as permissions.

## Authentication

Prove the caller is who they claim to be.

### Common methods

| Method                         | Idea                                              |
| ------------------------------ | ------------------------------------------------- |
| **Username / password**        | Something the user knows                          |
| **Multi-factor (MFA)**         | A second factor: a code, a device, a prompt       |
| **OAuth / social login**       | Sign in with another trusted provider             |
| **Biometrics**                 | Something the user is: face, fingerprint          |
| **Certificate-based**          | A cryptographic cert the client holds             |
| **Single Sign-On (SSO)**       | Authenticate once, use many internal services     |

Pick the method from the threat model, not from fashion. A public consumer app often starts with password plus MFA, or OAuth. Internal tools often use SSO. Machines often use certificates or API keys.

### Stateful vs stateless

After a successful login, the system has to remember that the caller is authenticated. That memory is either on the server or on the client.

**Stateful (session-based)**

* The server stores the session
* The client holds only a session id
* Invalidation is **fast**: delete the session, the user is out

```text
Authenticate
     │
     ▼
Store session in memory (or a session store)
     │
     ▼
Each request: look up the session, is it still valid?
```

**Stateless (token-based)**

* The client stores the token
* The server verifies the token. It does not have to look up a session
* Invalidation is **more complex**: the token stays valid until it expires, unless you add a denylist or short-lived tokens plus refresh

```text
Authenticate
     │
     ▼
Create a token, give it to the client
     │
     ▼
Each request: validate the token
     + refresh it when it is close to expiry
```

**Which is better for distributed systems?** Stateless.

A session in one server's memory does not exist on the next server. You then need sticky sessions or a shared session store. A token travels with the request. Any instance can verify it. **Stateless architecture makes scaling easier.**

Sessions still win when you need instant logout and a small number of servers. Distributed systems usually pay the extra invalidation complexity for the scaling.

## Authorization

The user is known. Now decide whether this action is allowed.

### Auth layers

Check permissions in more than one place. One layer is not a complete answer.

| Layer                 | Example                                              |
| --------------------- | ---------------------------------------------------- |
| **API gateway**       | Is this token allowed to hit `POST /tasks`?          |
| **Service**           | May this user create a task in this workspace?       |
| **Database**          | Row-level rules, roles, grants                       |
| **Object / data**     | May this user see *this* task, not just any task?    |

The gateway is a coarse filter. Object-level checks catch "user 12 must not read user 99's task." Skip a layer, and a valid token can still reach the wrong row.

### Common token types

Tokens are how the caller proves authentication, and often how they carry authorization claims.

| Type                 | Typical use                                         |
| -------------------- | --------------------------------------------------- |
| **JWT**              | Signed claims the server can verify without a lookup |
| **Session tokens**   | An id that points at a server-side session          |
| **API keys**         | Machines and integrations                           |
| **OAuth tokens**     | Access granted by another provider, scoped          |

A JWT can include roles or scopes. That does not replace object-level checks. It only tells you what the token claims.

### Client storage

Where the client keeps the token or session id:

| Place                      | Trade-off                                           |
| -------------------------- | --------------------------------------------------- |
| **Cookies**                | Sent automatically. Easy for the browser. Watch CSRF |
| **Local / session storage**| Easy to read from JavaScript. Watch XSS             |
| **In memory**              | Dies on refresh. Smallest footprint on disk         |

The storage choice is a security choice. It is not only a convenience choice.

## Putting it on a request

A write such as `POST /createTask` does both jobs, in order.

```text
Client
   │  POST /createTask
   ▼
Web server
   │
   ├─ 1. Authenticate
   │     a. create a token (on login)
   │     b. validate the token on every request
   │     c. refresh the token when needed
   │
   ├─ 2. Authorize
   │     can this user perform this action
   │     on this object?
   │
   └─ 3. Create the task
```

Skip step 1, and you do not know who is calling. Skip step 2, and a logged-in user can do everything.

## Comparison

|                    | Authentication                         | Authorization                              |
| ------------------ | -------------------------------------- | ------------------------------------------ |
| **Question**       | Who are you?                           | What can you do?                           |
| **When**           | First                                  | After identity is known                    |
| **Failure**        | 401: not identified                    | 403: identified, not allowed               |

|                    | Stateful (session)                     | Stateless (token)                          |
| ------------------ | -------------------------------------- | ------------------------------------------ |
| **Where state lives** | Server                              | Client                                     |
| **Invalidation**   | Fast                                   | Harder                                     |
| **Scaling**        | Needs shared session or stickiness     | Any server can verify                      |
| **Distributed default** | Usually not                       | Usually yes                                |

## Summary

Authentication is identity. Authorization is permission. Do them in that order, on every sensitive request.

Sessions are easy to revoke. Tokens are easy to scale. Distributed systems usually choose tokens, keep them short-lived, and still authorize at the service and at the data, not only at the gateway.
