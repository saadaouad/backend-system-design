# SSL/TLS Termination

**SSL/TLS** encrypts traffic between a client and a server. In the browser that shows up as **HTTPS**.

**SSL/TLS termination** is the process of **decrypting** that traffic. It usually happens at the **edge** of the infrastructure. Outside, the connection is HTTPS. Inside, it becomes HTTP.

```text
Request

Client  ── HTTPS ──►  xxxxxxxx  ── HTTP ──►  App
                      terminator

Response

Client  ◄── HTTPS ──  xxxxxxxx  ◄── HTTP ──  App
                      terminator
```

The terminator sits in the middle. It unwraps the encrypted request, forwards plain HTTP inward, then encrypts the response on the way back out.

## Why this is a separate concern

A common question: do you need a **separate service** for this, or should an authentication service (or every application) do it?

The work looks simple:

1. Decrypt the request
2. Process the request
3. Encrypt the response

Decrypting and encrypting is **slow**. Cryptography is computationally expensive. That is the nature of it.

If every application instance, or an auth service that already has other work, does termination on every request, CPU goes to crypto instead of the product. Termination belongs at the edge, on a component built to do it, unless there is a reason to push it further in.

Authentication answers **who the caller is**. TLS answers **whether the pipe is encrypted**. Keep them separate.

## Option 1: Termination at the load balancer

This is the **most common** approach.

The load balancer terminates TLS. Application servers receive **HTTP**.

```text
Client
   │  HTTPS
   ▼
Load balancer  (decrypt / encrypt)
   │  HTTP
   ├──► App 1
   ├──► App 2
   └──► App 3
```

**Why it is common:** crypto runs once, on hardware or processes that are good at it. Apps stay simple. Certificates live in one place.

**Cost:** the hop from the load balancer to the apps is plaintext. That is usually fine on a private network. It is not fine if that network is not trusted.

## Option 2: Termination at the application

The load balancer **passes through** encrypted traffic. Each application instance decrypts and encrypts on its own.

```text
Client
   │  HTTPS
   ▼
Load balancer  (passthrough)
   │  HTTPS
   ├──► App 1  (decrypt / encrypt)
   ├──► App 2  (decrypt / encrypt)
   └──► App 3  (decrypt / encrypt)
```

Traffic stays encrypted until it hits the process that handles the request.

**Why use it:** end-to-end encryption, or an environment where the load balancer must not see plaintext.

**Cost:** every instance pays the crypto bill. Certificates and TLS config are copied onto every app. Scaling out means scaling expensive work.

## Option 3: Re-encryption

Terminate at the load balancer, then **encrypt again** between the load balancer and the applications.

```text
Client
   │  HTTPS
   ▼
Load balancer  (terminate, then re-encrypt)
   │  HTTPS
   ├──► App 1
   ├──► App 2
   └──► App 3
```

The load balancer can still inspect, route, and offload the public certificate. The internal hop is not plaintext.

**Why use it:** you want edge termination **and** encryption on the private network.

**Cost:** you decrypt and encrypt twice. More CPU, more certificates, more moving parts. Use it when the internal network is not enough of a trust boundary.

## Comparison

|                         | Where TLS ends              | What the app sees | Main benefit                         | Main cost                          |
| ----------------------- | --------------------------- | ----------------- | ------------------------------------ | ---------------------------------- |
| **Load balancer**       | At the edge                 | HTTP              | Simple apps, crypto in one place     | Internal traffic is plaintext      |
| **Application**         | On each instance            | HTTPS             | Encrypted all the way in             | Crypto on every app                |
| **Re-encryption**       | Edge, then again internally | HTTPS             | Edge offload and internal encryption | Decrypt and encrypt twice          |

## Summary

SSL/TLS termination decrypts HTTPS at the edge and, in the usual setup, forwards HTTP inside.

Do not put that work on an auth service or on every application by default. Crypto is expensive.

Terminate at the load balancer when the internal network is private. Pass TLS through to the app when you need encryption all the way in. Re-encrypt when you want both: an edge terminator, and a private hop that is still HTTPS.
