# Nomuz

A secure platform for legal communication and case management.

---

## What it is

Nomuz centralizes case management and communication between lawyers, clients, and associates in a secure environment. Built with TypeScript across the stack, it focuses on privacy, real-time interaction, and clean architecture.

The project explores how modern web technologies can meet the strict requirements of the legal sector — where confidentiality isn't optional and data integrity matters.

---

## Architecture

```
Nomuz/
├── api/          NestJS backend
├── blockchain/   Planned integrity layer (incomplete)
└── frontend/     Next.js client
```

**Backend**  
NestJS · Prisma ORM · PostgreSQL · WebSockets

**Frontend**  
Next.js · shadcn/ui · TypeScript

**Security**  
End-to-end encrypted messaging · Role-based access control

---

## Features

- Encrypted messaging between lawyers, clients, and associates
- Legal case management with role-specific access
- Real-time communication via WebSockets
- Modular architecture with clear separation of concerns
- Strongly typed database layer with Prisma

---

## Tech decisions

**Why NestJS?**  
Modular structure with dependency injection made it easier to maintain clean boundaries between domains (auth, cases, messaging).

**Why E2E encryption?**  
Legal communications can't be exposed. Messages are encrypted client-side — the server never sees plaintext.

**Why WebSockets?**  
Real-time delivery matters in legal contexts. REST alone wouldn't cut it for instant notifications and live updates.

**Why Prisma?**  
Type-safe queries and migrations kept the data layer predictable. The schema-first approach made collaboration easier.

---

## The blockchain layer

The original plan included on-chain message anchoring for tamper-proof audit trails. The architecture was designed with this in mind, but the infrastructure requirements (node setup, gas management, smart contracts) pushed it out of scope.

The system was delivered without it. The extension point remains if needed later.

---

## What I learned

**E2E encryption in a REST + WebSocket environment**  
Designing an encryption flow that works across both HTTP and WebSocket channels required careful key management. The main challenge was ensuring only the intended recipient could decrypt messages, without the server holding plaintext.

**Real-time architecture with NestJS**  
Integrating WebSockets into NestJS while keeping it modular was non-trivial. Gateways had to be scoped properly, and the event system needed to integrate with services without creating circular dependencies.

**Monorepo without tooling**  
Managing shared types and utilities across `api`, `frontend`, and `blockchain` without Turborepo or nx required discipline. It taught me the importance of enforcing boundaries early.

**Knowing when to stop**  
The blockchain layer was ambitious but introduced complexity beyond the project timeline. I learned to architect with extension points in mind, but also to ship without features when needed.

---

## Running it

**Prerequisites**
- Node.js 18+
- PostgreSQL

**Setup**

```bash
git clone https://github.com/vbzt/Nomuz.git
cd Nomuz

# Install dependencies
cd api && npm install
cd ../frontend && npm install
```

**Environment**

Create `api/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nomuz"
JWT_SECRET="your_secret_here"
```

**Start**

```bash
# Backend
cd api && npm run dev

# Frontend
cd frontend && npm run dev
```

---

## Team

**Backend** — [@vbzt](https://github.com/vbzt)  
API architecture · Prisma modeling · WebSockets · Encryption flow

**Frontend** — [@vhnb](https://github.com/vhnb)  
UI implementation · Component architecture · Client integration

---

## Why this matters

Legal communication demands care:
- Messages can't be intercepted or tampered with
- Case records must be auditable
- Delays in communication can have legal consequences

Nomuz is a technical exploration of how a modern TypeScript stack can meet these requirements with a secure-by-design approach.

---

Built with TypeScript and a lot of encrypted messages.
