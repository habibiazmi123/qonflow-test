# Mini Task Manager — Project Guide

## Project Overview

Mini Task Manager is an internal tool for managing simple tasks with immutable audit logs. Built as a take-home engineering evaluation.

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Node.js + Express + TypeScript
- **Storage**: In-memory (volatile)

## Context Files

Read these files in order before implementing or making architectural decisions:

1. `context/project-overview.md` — Product definition, goals, features, and scope
2. `context/architecture.md` — System structure, boundaries, storage model, invariants
3. `context/ui-context.md` — Layout, component structure, visual conventions
4. `context/code-standards.md` — Implementation rules, file organization, conventions
5. `context/ai-workflow-rules.md` — Development workflow, scoping rules, delivery approach
6. `context/progress-tracker.md` — Current phase, completed work, next steps

## Quick Start

```bash
# Terminal 1: Backend
cd server
npm install
npm run dev

# Terminal 2: Frontend
cd client
npm install
npm run dev
```

- Backend runs on `http://localhost:3001`
- Frontend runs on `http://localhost:5173`

## Key Architectural Rules

1. **Status flow is strict**: `to_do → pending → in_progress → done` — no skipping, no going backward
2. **Audit logs are immutable**: append-only, never edited or deleted
3. **Idempotent updates**: changing to the same status does not create a log entry
4. **Backend is the authority**: all domain validation happens server-side

## Project Structure

```
├── server/
│   ├── src/
│   │   ├── index.ts           — Express entry point
│   │   ├── routes/            — Route definitions
│   │   ├── services/          — Business logic
│   │   ├── store/             — In-memory data store
│   │   ├── types.ts           — Shared interfaces
│   │   └── utils.ts           — Validation helpers
│   ├── package.json
│   └── tsconfig.json
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/        — React components
│   │   ├── hooks/             — Custom hooks
│   │   ├── api.ts             — API client
│   │   ├── types.ts           — Shared interfaces
│   │   └── main.tsx           — React entry
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── context/                   — Project context/docs
├── CLAUDE.md                  — This file
└── README.md                  — Deliverable documentation
```

## Update Progress Tracker

After each meaningful implementation change, update `context/progress-tracker.md` with the current status.

If implementation changes the architecture, scope, or standards in the context files, update the relevant file before continuing.
