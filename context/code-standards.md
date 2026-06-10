# Code Standards

## General

- Keep modules small and single-purpose. A file should have one reason to change.
- Fix root causes — do not layer workarounds on top of known issues.
- Do not mix unrelated concerns in one module or component.
- Prefer clarity over cleverness. Code is read far more often than it is written.
- Use consistent naming: PascalCase for types/interfaces/components, camelCase for variables/functions/files.

## TypeScript

- Strict mode is required throughout the project (`strict: true` in tsconfig).
- Avoid `any` — use explicit interfaces or generics. When interfacing with unknown external input, validate at the boundary.
- Define shared types in a `types.ts` or `shared/types.ts` file so frontend and backend use the same contracts.
- Use `enum` or union types for fixed sets like TaskStatus.

## React (Frontend)

- Use functional components with hooks. No class components.
- Keep components focused: a component does one thing well.
- Extract reusable logic into custom hooks (e.g., `useTasks`, `useAuditLogs`).
- State management: React built-in state (`useState`, `useReducer`) is sufficient — no external state library needed.
- API calls: centralize in an `api.ts` module — do not spread fetch calls across components.

## Express (Backend)

- Organize routes by resource: `/routes/tasks.ts`, `/routes/auditLogs.ts`.
- Route handlers delegate to controller or service functions — no inline logic in route definitions.
- Validate and parse request input before any business logic runs. Return structured error responses for invalid input.
- Use HTTP status codes meaningfully: 200 for success, 201 for creation, 400 for bad request, 404 for not found, 409 for conflict.

## API Routes

- Validate request body/params at the handler entry point.
- Return consistent JSON response shapes:
  ```typescript
  // Success
  { "data": { ... } }
  // Error
  { "error": { "message": "...", "code": "..." } }
  ```
- Domain validation (status flow) happens in the service layer, not routes.

## Data and Storage

- The in-memory store is a simple module (`store.ts`) — export functions to read/write tasks and audit logs.
- All store access goes through this module. No module directly mutates a global array.
- If switching to a database later, only `store.ts` changes.

## File Organization

```
mini-task-manager/
├── server/
│   ├── src/
│   │   ├── index.ts            — Express app setup and entry point
│   │   ├── routes/             — Route definitions
│   │   │   ├── tasks.ts
│   │   │   └── auditLogs.ts
│   │   ├── services/           — Business logic
│   │   │   ├── taskService.ts
│   │   │   └── auditLogService.ts
│   │   ├── store/              — Data storage layer
│   │   │   └── store.ts
│   │   ├── types.ts            — Shared types/interfaces
│   │   └── utils.ts            — Helpers (validation, etc.)
│   ├── package.json
│   └── tsconfig.json
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/         — React components
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── AuditLog.tsx
│   │   │   ├── CreateTaskForm.tsx
│   │   │   └── ActorSelector.tsx
│   │   ├── hooks/              — Custom React hooks
│   │   │   ├── useTasks.ts
│   │   │   └── useAuditLogs.ts
│   │   ├── api.ts              — API client
│   │   ├── types.ts            — Shared types (mirrors server)
│   │   └── main.tsx            — React entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── context/                    — Project context files
└── README.md
```

## Error Handling

- Backend: use a centralized error handler middleware. Service functions throw typed errors; the handler catches and formats the response.
- Frontend: catch API errors in hooks and surface them as simple UI messages (no toast framework needed).

## Testing

- Not required for this evaluation. If writing tests, place them in `__tests__/` adjacent to the module under test.
