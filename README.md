# Mini Task Manager — TaskCore

An internal tool for managing simple tasks with immutable audit logs. Built as a take-home engineering evaluation.

- **Frontend**: React + TypeScript (Vite), TanStack Query, react-hook-form + Zod
- **Backend**: Node.js + Express + TypeScript, Zod validation, Swagger docs
- **Styling**: Tailwind v4 with Material 3 design system (Stitch)
- **Storage**: In-memory (volatile)

---

## How to Run

### Prerequisites

- Node.js 18+ and npm

### Backend

```bash
cd server
npm install
npm run dev
```

The server starts at **http://localhost:3001**.
API docs (Swagger UI) at **http://localhost:3001/api-docs**.

### Frontend

```bash
cd client
npm install
npm run dev
```

The dev server starts at **http://localhost:5173** and proxies `/api` requests to the backend.

---

## API Reference

Interactive Swagger UI is available at `http://localhost:3001/api-docs` when the server is running.

| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| GET    | `/api/tasks`               | List all tasks           |
| POST   | `/api/tasks`               | Create a new task        |
| PUT    | `/api/tasks/:id/status`    | Update task status       |
| DELETE | `/api/tasks/:id`           | Delete a task            |
| GET    | `/api/tasks/:id/audit-logs`| Get audit log for a task |
| GET    | `/api/health`              | Health check             |

### Status Flow (strict — one step, no going back)

```
to_do → pending → in_progress → done
```

### Request Examples

**POST `/api/tasks`**
```json
{ "title": "Prepare Invoice", "description": "Q1 invoice prep" }
```

**PUT `/api/tasks/:id/status`**
```json
{ "status": "in_progress", "actor": "john.doe" }
```

| Field    | Valid Values                                      |
| -------- | ------------------------------------------------- |
| `status` | `to_do`, `pending`, `in_progress`, `done`         |
| `actor`  | `john.doe`, `jane.smith`, `bob.wilson`            |

> **Idempotency**: Updating to the same status is a no-op — no audit log entry is created.

---

## Architecture

```
├── server/                         # Express backend
│   ├── src/
│   │   ├── index.ts                # App entry point + Swagger UI mount
│   │   ├── swagger.ts              # OpenAPI 3.0 spec definition
│   │   ├── validation.ts           # Zod schemas (create task, update status)
│   │   ├── routes/                 # Route handlers with OpenAPI annotations
│   │   │   ├── tasks.ts            # Task CRUD endpoints
│   │   │   └── auditLogs.ts        # Audit log endpoint
│   │   ├── services/               # Business logic + domain validation
│   │   │   ├── taskService.ts      # Task operations with status flow enforcement
│   │   │   └── auditLogService.ts  # Append-only audit log recording
│   │   ├── store/                  # In-memory data store
│   │   │   └── store.ts            # Map + array storage (swappable)
│   │   └── types.ts                # Shared TypeScript interfaces
│   ├── package.json
│   └── tsconfig.json
├── client/                         # React frontend
│   ├── src/
│   │   ├── main.tsx                # React entry + QueryClientProvider
│   │   ├── App.tsx                 # Root layout (top nav + centered content)
│   │   ├── api.ts                  # API client (fetch wrapper)
│   │   ├── types.ts                # TypeScript interfaces
│   │   ├── hooks/
│   │   │   └── useTasks.ts         # TanStack Query hooks (useQuery, useMutation)
│   │   ├── components/
│   │   │   ├── ActorSelector.tsx   # Avatar + dropdown actor switcher
│   │   │   ├── CreateTaskForm.tsx  # Modal form with react-hook-form + Zod
│   │   │   ├── TaskList.tsx        # Task list container with empty state
│   │   │   ├── TaskCard.tsx        # Task card with status pill + actions
│   │   │   └── AuditLog.tsx        # Timeline-style audit log
│   │   └── index.css               # Tailwind v4 + Material 3 theme tokens
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── context/                        # Project context docs
├── server/API.md                   # API documentation (markdown)
├── CLAUDE.md                       # AI assistant project guide
└── README.md
```

### Layering

```
Routes (Zod validation at entry)
  → Services (business logic, status flow enforcement)
    → Store (in-memory Map + array, swappable)
```

Routes handle HTTP parsing, Zod input validation, and response formatting. Services contain all business logic and domain rules (status transitions, idempotency). Store is a thin data access layer — only `store.ts` changes to swap to a database.

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **In-memory storage** | Zero setup — no database, no migrations, no env vars. Store is isolated to a single file for easy swapping. |
| **TanStack Query** | Reactive data fetching with automatic cache invalidation. Status mutations invalidate both tasks and audit logs, keeping the UI synced without manual state management. |
| **Zod validation** | Shared validation logic on both client and server. `safeParse()` ensures type-safe, predictable error handling at the API boundary. |
| **react-hook-form** | Performant form state management with Zod integration via `@hookform/resolvers`. Reduces re-renders and boilerplate. |
| **Tailwind v4** | Vite-native plugin (no PostCSS, no config file). Material 3 design tokens defined via `@theme` directive. |
| **Stitch design system** | Full Material 3 palette (deep slate blue primary, layered surfaces). Typography: Inter + JetBrains Mono. Timeline audit log with vertical line + dot nodes. |
| **Audit log as separate ordered list** | Append-only array makes immutability trivial — no update/delete path exposed. |
| **Actor dropdown + hardcoded list** | Traceability without auth. Server-side validation blocks arbitrary actor injection. |

---

## Assumptions

1. **No authentication needed** — the PRD explicitly says to skip auth/roles. Actor field is sufficient for traceability.
2. **Single-user-ish usage** — in-memory storage and no locking means one server process. Fine for small teams.
3. **Desktop-first** — UI targets ~1024px+ viewports. Not optimized for mobile.
4. **Browser refreshes lose state** — in-memory storage is volatile. Acceptable for evaluation scope.

---

## Trade-offs

| Trade-off | What was chosen | What was sacrificed |
|-----------|-----------------|---------------------|
| **Storage**       | In-memory (no setup)           | Data lost on restart            |
| **Project structure** | Two independent packages   | Type duplication across projects |
| **Error handling** | `alert()` + inline validation | Less polished UX than toasts     |
| **State management** | TanStack Query (server cache) | No offline support               |
| **Data fetching** | Polling via invalidateQueries  | No real-time push (WebSocket)    |
| **Audit log** | Append-only array in memory | Unbounded growth over time       |

---

## What Would Be Improved With More Time

1. **Persistent storage** — swap in-memory store for SQLite or PostgreSQL. Only `store.ts` changes.
2. **Pagination** — for task lists and audit logs beyond a few hundred entries.
3. **Better error UX** — replace `alert()` with toast notifications and inline field errors.
4. **Filtering and search** — filter tasks by status, search by title.
5. **Responsive layout** — tablet and mobile support.
6. **Optimistic updates** — update UI immediately on status change, revert on server error.

---

## Discussion Questions

### How do you ensure audit logs cannot be modified?

The audit log is stored as an append-only array in `store.ts`. The store module only exposes `createAuditLog()` and `getAuditLogsForTask()` — there is no `updateAuditLog()` or `deleteAuditLog()` function anywhere in the codebase. The routes and services layers have no access to modify audit entries either. In a production system with a database, this would be enforced via database permissions (e.g., `INSERT` only, no `UPDATE`/`DELETE` grants) or by using an append-only log structure like a database table with triggers that reject mutations.

### What is the most risky part of this solution for many users?

**In-memory storage** is the biggest risk: (1) data loss on server restart, (2) no concurrency control for write operations, and (3) unbounded memory growth as audit logs accumulate. For a team of 3–5 it would work. For 50+ users, you'd want a database, request-level locking or transactions, and log rotation.

### If this grew into a large system, what would you refactor first?

1. **The store layer** — swap in-memory for a database (PostgreSQL), adding migrations and connection pooling. This is a single-file change thanks to the store abstraction.
2. **Actor management** — replace the hardcoded list with a users table and authentication. This touches services, routes, and the frontend.
3. **API versioning** — add `/api/v1/` prefix so the API can evolve without breaking existing clients.
4. **Formal error types** — replace the ad-hoc `ValidationError`/`NotFoundError` classes with a structured error hierarchy that maps to HTTP status codes consistently.

---

## AI Assistance

This project was built with AI assistance (Claude Code). The AI was used for:

- **Scaffolding** — generating project configs (package.json, tsconfig, vite.config)
- **Code generation** — implementing routes, store, services, and components from the PRD specification
- **Documentation** — drafting the README, context files, and API docs
- **Migration** — converting plain CSS to Tailwind v4, React state to TanStack Query, adding Zod validation and Swagger

**Validation approach**: Every generated block of code was reviewed before acceptance. TypeScript strict mode ensured type safety. The backend was verified with curl smoke tests for all valid and invalid transitions. The frontend was verified by running the dev server and testing the UI end-to-end. The Vite build and `tsc --noEmit` pass cleanly.
