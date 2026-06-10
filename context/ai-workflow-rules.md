# AI Workflow Rules

## Approach

Build the Mini Task Manager incrementally using context-driven workflow. The context files define what to build, how to build it, and the current state of progress. Always implement against these specs — do not infer or invent behavior beyond what is documented.

Work in small, verifiable steps. Each step produces a working increment that can be tested end-to-end before moving on.

## Initialization Sequence

Before any implementation begins, read the following in order:

1. `context/project-overview.md` — understand the product, goals, and scope
2. `context/architecture.md` — understand the system structure and invariants
3. `context/ui-context.md` — understand the visual layout and component breakdown
4. `context/code-standards.md` — understand the implementation conventions
5. `context/progress-tracker.md` — understand what has been done and what is next

## Scoping Rules

- Work on one feature unit at a time
- Prefer small, verifiable increments over large speculative changes
- Do not combine unrelated system boundaries in a single implementation step
- Each unit must be testable end-to-end before moving to the next

## Implementation Order

1. **Scaffold** — Initialize both projects (server + client), install dependencies, configure TypeScript
2. **Shared types** — Define Task and AuditLogEntry types in both projects
3. **Backend store** — Implement in-memory store module
4. **Backend services** — Task service (CRUD + status validation) and AuditLog service (append-only)
5. **Backend routes** — Express routes for tasks and audit logs
6. **Backend smoke test** — Verify all endpoints with curl or similar
7. **Frontend API client** — API module and custom hooks
8. **Frontend components** — Build all UI components
9. **Integration test** — End-to-end walkthrough
10. **README** — Write project documentation

## When to Split Work

Split an implementation step if it combines:

- Frontend and backend changes (except shared types)
- Multiple unrelated API routes
- Behavior not clearly defined in the context files

If a change cannot be verified end to end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior not defined in the context files.
- If a requirement is ambiguous, resolve it in the relevant context file before implementing.
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing.

## Protected Files

No files are protected in this project — everything is fair game for implementation changes. Be cautious with `package.json` and config files: understand a change before making it.

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:

- System architecture or boundaries → `architecture.md`
- Storage model decisions → `architecture.md`
- Code conventions or standards → `code-standards.md`
- Feature scope → `project-overview.md`
- UI layout or components → `ui-context.md`

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope
2. No invariant defined in `architecture.md` was violated
3. `progress-tracker.md` reflects the completed work
4. Both `npm run build` (server) and `npm run build` (client) pass

## AI-Assisted Development Notes

- If using AI assistance, validate every generated block of code before accepting it
- Do not let AI make architectural decisions — those belong in the context files
- AI-generated code must follow the same standards as hand-written code
