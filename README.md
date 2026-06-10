# Mini Task Manager

An internal tool for managing simple tasks with immutable audit logs. Built as a take-home engineering evaluation.

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Node.js + Express + TypeScript
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

### Frontend

```bash
cd client
npm install
npm run dev
```

The dev server starts at **http://localhost:5173** and proxies `/api` requests to the backend.

---

## API Reference

| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| GET    | `/api/tasks`               | List all tasks           |
| POST   | `/api/tasks`               | Create a new task        |
| PUT    | `/api/tasks/:id/status`    | Update task status       |
| DELETE | `/api/tasks/:id`           | Delete a task            |
| GET    | `/api/tasks/:id/audit-logs`| Get audit log for a task |

### POST `/api/tasks`

```json
{ "title": "Prepare Invoice", "description": "Q1 invoice prep" }
```

### PUT `/api/tasks/:id/status`

```json
{ "status": "in_progress", "actor": "john.doe" }
```

Valid actors: `john.doe`, `jane.smith`, `bob.wilson`

Valid status flow: `to_do → pending → in_progress → done` (one step at a time, no going back)

---

## Architecture

```
├── server/                     # Express backend
│   ├── src/
│   │   ├── index.ts            # App entry point
│   │   ├── routes/             # Route handlers
│   │   ├── services/           # Business logic + domain validation
│   │   ├── store/              # In-memory data store
│   │   └── types.ts            # Shared interfaces
├── client/                     # React frontend
│   ├── src/
│   │   ├── App.tsx             # Root component
│   │   ├── components/         # UI components
│   │   ├── hooks/              # Custom hooks (useTasks, useAuditLogs)
│   │   ├── api.ts              # API client
│   │   └── types.ts            # Shared interfaces (mirrors server)
│   └── index.html
├── context/                    # Project context docs
└── README.md
```

### Layering

```
Routes → Services → Store (in-memory)
         ↑
     Domain validation (status flow, idempotency)
```

Routes handle HTTP parsing and response formatting. Services contain all business logic and validation. Store is a thin data access layer that could be swapped for a database without touching services or routes.

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **In-memory storage** | Keeps setup frictionless — no database, no migrations, no env vars. The store module is the only file that would change to add persistence. |
| **Separate server/ and client/** | Simpler than a monorepo workspace. No shared build tooling. Some type duplication is an acceptable trade-off for zero-config isolation. |
| **Services layer** | Routes are thin. All domain validation (status flow, idempotency) lives in services, making it testable without HTTP. |
| **Audit log as separate ordered list** | An append-only array makes immutability trivial to enforce — there is no update/delete path exposed for audit entries. |
| **Actor dropdown + hardcoded list** | Meets the requirement without introducing auth. The list is validated server-side so the frontend can't inject arbitrary actors. |

---

## Assumptions

1. **No authentication needed** — the PRD explicitly says to skip auth/roles. The actor field is sufficient for traceability.
2. **Single-user-ish usage** — in-memory storage and no locking means one server process, one set of data. Concurrent requests are serialized by Node's event loop, which is fine for an internal tool.
3. **Desktop-first** — the UI targets ~1024px+ viewports. Not optimized for mobile.
4. **Browser refreshes lose state** — in-memory storage is volatile. This is acceptable for the evaluation scope.

---

## Trade-offs

| Trade-off | What was chosen | What was sacrificed |
|-----------|-----------------|---------------------|
| **Storage** | In-memory (no setup) | Data lost on restart |
| **Project structure** | Two independent packages | Type duplication between server and client |
| **UI** | Plain CSS, no framework | More manual styling, less consistency than a design system |
| **Error handling** | Simple `alert()` calls on frontend | Less polished UX than toast notifications |
| **State management** | React built-in state + custom hooks | No offline support, no optimistic updates |

---

## What Would Be Improved With More Time

1. **Persistent storage** — swap the in-memory store for SQLite (via better-sqlite3) or PostgreSQL. The store module is already isolated for this.
2. **Pagination** — for task lists and audit logs as they grow beyond a few hundred entries.
3. **Better error UX** — replace `alert()` with inline validation messages and toast notifications.
4. **Filtering and search** — filter tasks by status, search by title.
5. **Responsive layout** — make the UI work on tablets and phones.
6. **Optimistic updates** — update the UI immediately and revert on server error.

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
- **Code generation** — implementing boilerplate routes, store, and components from the PRD specification
- **Documentation** — drafting the README and context files

**Validation approach**: Every generated block of code was reviewed before acceptance. TypeScript strict mode ensured type safety. The backend was verified with curl smoke tests for all valid and invalid transitions. The frontend was verified by running the dev server and testing the UI end-to-end.

---

## License

MIT — evaluation project.
