<div align="center">

# Nomuz

**Secure legal communication and case management platform**

*Designed for confidentiality, real-time collaboration, and scalability.*

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

[![Status](https://img.shields.io/badge/Status-Completed-22c55e?style=for-the-badge)]()
[![Blockchain](https://img.shields.io/badge/Blockchain-Planned%20%2F%20Incomplete-f59e0b?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-Open%20Source-6366f1?style=for-the-badge)]()

</div>

---

## 📖 Overview

Nomuz is a full-stack application that centralizes case management and communication between lawyers, clients, and associates in a secure environment tailored for the legal domain.

Built with a modern TypeScript stack, the platform focuses on **privacy**, **real-time interaction**, and **clean architecture** — exploring how modern web technologies can meet the strict requirements of the legal sector.

---

## ✨ Key Features

- 🔐 **End-to-end encrypted messaging** — confidential communication by design
- ⚖️ **Legal case management** — centralized workspace for case tracking
- 👥 **Multi-role system** — lawyers, clients, and associates each with distinct access
- ⚡ **Real-time communication** — powered by WebSockets
- 🧱 **Modular architecture** — clean separation of concerns across all layers
- 🗄️ **Strongly typed database layer** — Prisma ORM with full TypeScript integration
- 🎯 **Built for high-confidentiality environments** — security as a first-class concern

---

## 🏗️ Architecture

Nomuz is structured as a modular monorepo with clear layer separation:

```
Nomuz/
├── api/          # NestJS backend — business logic, auth, database access, WebSockets
├── blockchain/   # Planned on-chain layer for message anchoring and integrity (incomplete)
└── frontend/     # Next.js client — UI, routing, client-side integration
```

### Backend
- **NestJS** — modular, scalable framework with dependency injection
- **Prisma ORM** — strongly typed schema and database access
- **PostgreSQL** — relational data persistence
- **WebSockets** — real-time bidirectional communication
- **E2E encryption flow** — message confidentiality at the application layer

### Frontend
- **Next.js** — React framework with SSR and file-based routing
- **shadcn/ui** — accessible and composable component library
- **TypeScript** — end-to-end type safety across the stack

### Blockchain *(Planned Layer)*

The blockchain integration was designed to:
- Anchor message hashes on-chain for tamper-proof integrity
- Provide verifiable audit trails for legal communications
- Enhance trust through decentralized message validation

> ⚠️ **Not finalized** — the blockchain layer was not completed due to infrastructure and time constraints. The project was concluded and delivered without it, but the system was architected with this extension in mind.

---

## 📊 Technical Metrics

| Layer | Pattern | Key Technologies |
|---|---|---|
| API | Layered (Controller → Service → Repository) | NestJS, Prisma, PostgreSQL |
| Realtime | Event-driven | WebSockets (Socket.io) |
| Frontend | Component-driven | Next.js, shadcn/ui |
| Security | E2E encryption + role-based access | Custom encryption flow |
| Database | Schema-first, strongly typed | Prisma ORM |
| Monorepo | Module separation by domain | TypeScript throughout |

---

## 🛠️ Tech Stack

| Area | Stack |
|---|---|
| Language | TypeScript |
| Backend | NestJS · Prisma ORM · PostgreSQL · WebSockets |
| Frontend | Next.js · shadcn/ui |
| Security | End-to-End Encryption · Role-based access control |
| Architecture | Modular Monorepo · Layered pattern · Clean separation of concerns |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL instance running

### Installation

```bash
git clone https://github.com/vbzt/Nomuz.git
cd Nomuz
```

Install dependencies for each module:

```bash
# API
cd api && npm install

# Blockchain
cd ../blockchain && npm install

# Frontend
cd ../frontend && npm install
```

### Environment Variables

Create a `.env` file inside the `api/` folder:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nomuz"
JWT_SECRET="your_secret_here"
```

### Running the Project

```bash
# Start backend
cd api
npm run dev

# Start frontend
cd frontend
npm run dev
```

---

## 🧩 API Highlights

- **Authentication** — JWT-based auth with role-aware guards
- **Case Management** — full CRUD for legal cases, linked to users and associates
- **Messaging** — encrypted message persistence with real-time delivery via WebSockets
- **Role System** — distinct access levels for `lawyer`, `client`, and `associate`
- **Modular NestJS structure** — each domain is an isolated, testable module

---

## ⚔️ Challenges & Learnings

### 🔐 Implementing E2E Encryption in a REST + WebSocket environment
Designing an encryption flow that works consistently across both HTTP and WebSocket channels required careful key management and a shared encryption contract between backend and frontend. The main challenge was ensuring messages could only be decrypted by the intended recipient, without the server ever holding plaintext.

**Learned:** How to structure an E2E encryption layer in a full-stack TypeScript app, and the trade-offs between server-side and client-side decryption.

---

### ⚡ Real-time architecture with NestJS + WebSockets
Integrating WebSockets into a modular NestJS architecture while keeping it clean and maintainable was non-trivial. Gateways had to be properly scoped, and the event system needed to integrate with the existing service layer without creating circular dependencies.

**Learned:** NestJS gateway lifecycle, event namespacing, and how to keep real-time logic decoupled from business logic.

---

### 🧱 Monorepo structure and cross-module concerns
Managing shared types, contracts, and utilities across `api`, `frontend`, and `blockchain` folders without a dedicated package manager (like Turborepo or nx) required discipline and clear conventions.

**Learned:** The importance of enforcing boundaries early, and what a proper monorepo setup would look like at scale.

---

### ⛓️ Blockchain layer — knowing when to stop
The blockchain layer was designed with ambition — on-chain message anchoring for tamper-proof legal records. However, the required infrastructure (node setup, gas management, smart contract deployment) introduced complexity that was out of scope for the project timeline.

**Learned:** How to architect a system with extension points in mind, and how to make the pragmatic call to ship without a feature rather than delay delivery indefinitely.

---

## 🎯 Project Goals

Nomuz was created to explore:
- Secure communication in the legal sector
- Real-time systems with WebSockets
- End-to-end encryption workflows
- Scalable backend architecture with NestJS
- Clean separation of concerns in a full-stack TypeScript environment

---

## 👨‍💻 Team

<table>
  <tr>
    <td align="center">
      <strong>🔧 Backend Developer</strong><br/>
      <a href="https://github.com/vbzt">@vbzt</a><br/>
      <sub>API architecture · Prisma modeling · WebSockets · Encryption flow · Modular service structure</sub>
    </td>
    <td align="center">
      <strong>🎨 Frontend Developer</strong><br/>
      <a href="https://github.com/vhnb">@vhnb</a><br/>
      <sub>UI implementation · Component architecture · Client-side integration</sub>
    </td>
  </tr>
</table>

---

## 📌 Why This Project Matters

Legal communication demands a level of care that most platforms don't provide:

- **Confidentiality** — messages cannot be exposed, intercepted, or tampered with
- **Data integrity** — case records must be trustworthy and auditable
- **Reliable real-time interaction** — delays in communication can have real legal consequences

Nomuz is a technical exploration of how a modern TypeScript stack can meet these requirements with a **secure-by-design** approach — without sacrificing developer experience or scalability.

---

## 📄 License

This project is open source and available for study and contributions.

---

<div align="center">
  <sub>Built with TypeScript, care, and a lot of encrypted messages. ⚖️</sub>
</div>
