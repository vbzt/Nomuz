<div align="center">

# Nomuz

### Secure platform for legal communication and case management

Built with TypeScript · Designed for confidentiality

[Architecture](#architecture) • [Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started)

</div>

---

## Overview

Nomuz centralizes case management and communication between lawyers, clients, and associates in a secure environment. The platform explores how modern web technologies can meet the strict requirements of the legal sector — where confidentiality isn't optional and data integrity matters.

<br/>

## Architecture

The project is structured as a modular monorepo with clear separation of concerns:

```
Nomuz/
├── api/          # NestJS backend
├── blockchain/   # Planned integrity layer (incomplete)
└── frontend/     # Next.js client
```

### Stack

<table>
<tr>
<td>

**Backend**
- NestJS
- Prisma ORM
- PostgreSQL
- WebSockets

</td>
<td>

**Frontend**
- Next.js
- shadcn/ui
- TypeScript

</td>
<td>

**Security**
- AES-256-GCM encryption (server-side)
- Granular authorization (guard hierarchy)
- JWT authentication + bcrypt

</td>
</tr>
</table>

<br/>

## Features

| Feature | Description |
|---------|-------------|
| **Encrypted Messaging** | Messages are encrypted at rest with AES-256-GCM (random IV + authentication tag) before being stored |
| **Granular Authorization** | Guard hierarchy (chat membership → admin → owner) checks access per resource, not just per request |
| **Case Management** | Centralized workspace for legal case tracking with role-specific access |
| **Real-time Updates** | WebSocket-powered live notifications and message delivery across multiple clients |
| **Secure Auth Flow** | JWT + bcrypt, with single-use, time-limited password reset tokens |
| **Type Safety** | Strongly typed database layer with Prisma ORM, atomic transactions for multi-entity operations |

<br/>

## Tech Stack

#### Why NestJS?
Modular structure with dependency injection made it easier to maintain clean boundaries between domains (auth, cases, messaging).

#### Why AES-256-GCM?
Legal communications need strong encryption at rest. Messages are encrypted with AES-256-GCM (random IV, authentication tag) before hitting the database. This is **server-side encryption, not end-to-end**: the backend receives plaintext from the client and encrypts it before storage, so the server does have access to message content in memory during that step. A true E2E design would require encrypting on the client before the message ever reaches the API. See [What I Learned](#what-i-learned) for how this shaped the next iteration of the architecture.

#### Why a guard hierarchy?
Authentication alone (`@UseGuards(AuthGuard)`) only proves who the user is, not what they're allowed to do. Nomuz layers `ChatAccessGuard`, `ChatAdminGuard`, and `ChatOwnerGuard` on top so each action checks the specific relationship between the user and the resource, e.g., deleting a group requires being authenticated, a member of that chat, and its owner.

#### Why WebSockets?
Real-time delivery matters in legal contexts. REST alone wouldn't cut it for instant notifications and live updates.

#### Why Prisma?
Type-safe queries and migrations kept the data layer predictable. The schema-first approach made collaboration easier, and constraints like `@@unique([chat_id, user_id])` push integrity rules down to the database instead of relying only on application code.

<br/>

## The Blockchain Layer

> **Note:** The original plan included on-chain message anchoring for tamper-proof audit trails, since a hash stored in the same database as its content can be altered by anyone with sufficient database privileges. The architecture was designed with this in mind, but infrastructure requirements (node setup, gas management, smart contracts) pushed it out of scope.

The system was delivered without it. The `blockchain/` directory reflects that: it's a placeholder for the extension point, not a working implementation.

<br/>

## What I Learned

<details>
<summary><b>Server-side encryption vs. true E2E</b></summary>
<br/>

I implemented AES-256-GCM encryption in the backend, encrypting messages before they're written to the database. Partway through, I realized this doesn't meet the bar for true end-to-end encryption, since the server still receives and briefly holds plaintext before encrypting it. A real E2E design would encrypt on the client and have the server store ciphertext it can never read. That gap is now the clearest next step if I revisit this project: move the encryption boundary to the client.

</details>

<details>
<summary><b>Authorization is not the same as authentication</b></summary>
<br/>

Building the guard hierarchy made the difference between "is this user logged in" and "is this user allowed to do this specific thing to this specific resource" very concrete. Most of the interesting bugs I had to fix during development were authorization edge cases, not authentication ones.

</details>

<details>
<summary><b>Real-time architecture with NestJS</b></summary>
<br/>

Integrating WebSockets into NestJS while keeping it modular was non-trivial. Gateways had to be scoped properly, and the event system needed to integrate with services without creating circular dependencies.

</details>

<details>
<summary><b>Monorepo without tooling</b></summary>
<br/>

Managing shared types and utilities across `api`, `frontend`, and `blockchain` without Turborepo or nx required discipline. It taught me the importance of enforcing boundaries early.

</details>

<details>
<summary><b>Knowing when to stop</b></summary>
<br/>

The blockchain layer was ambitious but introduced complexity beyond the project timeline. I learned to architect with extension points in mind, but also to ship without a feature when it isn't ready, instead of shipping a half-working version of it.

</details>

<br/>

## Getting Started

### Prerequisites

```bash
Node.js 18+
PostgreSQL
```

### Installation

```bash
# Clone the repository
git clone https://github.com/vbzt/Nomuz.git
cd Nomuz

# Install dependencies
cd api && npm install
cd ../frontend && npm install
```

### Configuration

Create `api/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nomuz"
JWT_SECRET="your_secret_here"
```

### Running

```bash
# Start backend
cd api && npm run dev

# Start frontend (in another terminal)
cd frontend && npm run dev
```

<br/>

## Team

| Role | Developer | Responsibilities |
|------|-----------|------------------|
| **Backend** | [@vbzt](https://github.com/vbzt) | API architecture · Prisma modeling · WebSockets · Encryption flow |
| **Frontend** | [@vhnb](https://github.com/vhnb) | UI implementation · Component architecture · Client integration |

<br/>

## Why This Matters

Legal communication demands care that most platforms don't provide:

- **Confidentiality** — Messages are encrypted at rest, with access gated by granular, per-resource authorization
- **Data integrity** — Case records are modeled with database-level constraints and atomic transactions
- **Real-time reliability** — Delays in communication can have legal consequences

Nomuz is a technical exploration of how a modern TypeScript stack can meet these requirements with a security-conscious design, including an honest account of where the current implementation falls short of the original plan.

---

<div align="center">

Built with TypeScript and a lot of encrypted messages

</div>
