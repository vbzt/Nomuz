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
- E2E encryption
- Role-based access
- JWT authentication

</td>
</tr>
</table>

<br/>

## Features

| Feature | Description |
|---------|-------------|
| **Encrypted Messaging** | End-to-end encrypted communication between lawyers, clients, and associates |
| **Case Management** | Centralized workspace for legal case tracking with role-specific access |
| **Real-time Updates** | WebSocket-powered live notifications and message delivery |
| **Modular Architecture** | Clean separation between auth, cases, and messaging domains |
| **Type Safety** | Strongly typed database layer with Prisma ORM |

<br/>

## Tech Stack

#### Why NestJS?
Modular structure with dependency injection made it easier to maintain clean boundaries between domains (auth, cases, messaging).

#### Why E2E encryption?
Legal communications can't be exposed. Messages are encrypted client-side — the server never sees plaintext.

#### Why WebSockets?
Real-time delivery matters in legal contexts. REST alone wouldn't cut it for instant notifications and live updates.

#### Why Prisma?
Type-safe queries and migrations kept the data layer predictable. The schema-first approach made collaboration easier.

<br/>

## The Blockchain Layer

> **Note:** The original plan included on-chain message anchoring for tamper-proof audit trails. The architecture was designed with this in mind, but infrastructure requirements (node setup, gas management, smart contracts) pushed it out of scope.

The system was delivered without it. The extension point remains if needed later.

<br/>

## What I Learned

<details>
<summary><b>E2E encryption in a REST + WebSocket environment</b></summary>
<br/>

Designing an encryption flow that works across both HTTP and WebSocket channels required careful key management. The main challenge was ensuring only the intended recipient could decrypt messages, without the server holding plaintext.

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

The blockchain layer was ambitious but introduced complexity beyond the project timeline. I learned to architect with extension points in mind, but also to ship without features when needed.

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

- **Confidentiality** — Messages can't be intercepted or tampered with
- **Data integrity** — Case records must be trustworthy and auditable
- **Real-time reliability** — Delays in communication can have legal consequences

Nomuz is a technical exploration of how a modern TypeScript stack can meet these requirements with a secure-by-design approach.

---

<div align="center">

Built with TypeScript and a lot of encrypted messages

</div>
