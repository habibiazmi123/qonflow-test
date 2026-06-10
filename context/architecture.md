# Architecture Context

## Stack

| Layer     | Technology                     | Role                                     |
| --------- | ------------------------------ | ---------------------------------------- |
| Frontend  | React + TypeScript (Vite)      | UI rendering, state management           |
| Backend   | Node.js + Express + TypeScript | REST API, business logic, data storage   |
| Storage   | In-memory (array + Map)        | Volatile persistence for evaluation      |
| Runtime   | tsx (TypeScript Execute)       | Run backend TypeScript directly          |

## System Boundaries

- `server/` — Express application: routes, controllers, data store, domain validation, audit log logic. Single-responsibility modules per resource (tasks, audit-logs).
- `client/` — Vite + React application: components, hooks, API client, types. Fetches data from the backend via fetch/axios.

## Storage Model

- **In-memory store**: Tasks stored in a `Map<TaskId, Task>`. Audit logs stored in a separate ordered list or per-task array. Data resets on server restart.
- **No database**: Chosen deliberately to keep the evaluation focused on code quality, not infrastructure. Swapping to a database later would only change the store layer — business logic is decoupled.

## Data Structures

```
Task {
  id: string (uuid)
  title: string
  description: string
  status: TaskStatus (to_do | pending | in_progress | done)
  createdAt: string (ISO timestamp)
  updatedAt: string (ISO timestamp)
}

AuditLogEntry {
  id: string (uuid)
  taskId: string
  actor: string
  fromStatus: TaskStatus
  toStatus: TaskStatus
  timestamp: string (ISO timestamp)
}
```

## Auth and Access Model

- No authentication. Actor is selected from a hardcoded dropdown list.
- No ownership — any actor can change any task.
- This is a deliberate simplification per the PRD requirements.

## Invariants

1. Status transitions must follow the exact order: to_do → pending → in_progress → done. No skipping, no going backward.
2. Audit log entries are append-only — never mutated, never deleted.
3. Updating to the same status is idempotent: no audit log entry is created.
4. Task status and its latest audit log entry must always be in sync.
5. The server is the single source of truth for all validation — client-side checks are cosmetic only.
