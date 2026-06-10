# Mini Task Manager

## Overview

An internal tool for a small team to manage simple tasks with full traceability. Every status change is recorded in an immutable audit log so the team always knows who changed what and when. Built as a take-home engineering evaluation — simplicity and correctness matter more than feature count.

## Goals

1. Allow users to create, update status, and delete tasks
2. Enforce a strict status flow: to_do → pending → in_progress → done
3. Record every status change in an immutable, chronological audit log
4. Display audit logs per task so users can trace all changes

## Core User Flow

1. User opens the app and sees a list of all tasks
2. User can create a new task by providing a title (and optional description)
3. User changes a task's status via a dropdown or button — only valid transitions are accepted
4. Each status change immediately creates an audit log entry showing who changed what, from/to which status, and when
5. User can expand/view a task to see its full audit log, ordered chronologically
6. User can delete a task (which removes it from the list)

## Features

### Task Management

- Create a task with title, description, and initial status (to_do)
- List all tasks with their current status clearly visible
- Update task status following the strict flow: to_do → pending → in_progress → done
- Delete a task

### Audit Log

- Every status change generates an immutable audit log entry
- Each entry records: task id, actor name, previous status, new status, timestamp
- Audit logs are displayed chronologically per task
- Logs cannot be edited or deleted under any circumstance

### Actor Selection

- Actors are selected from a predefined hardcoded user list via a dropdown
- Default actor list: ["john.doe", "jane.smith", "bob.wilson"]

## Scope

### In Scope

- Task CRUD (create, list, status update, delete)
- Immutable audit log for status changes
- Frontend UI with task list and per-task audit log display
- RESTful API with domain validation on the backend
- In-memory persistence (server-side)

### Out of Scope

- User authentication and authorization
- Role-based access control
- Real-time collaboration or WebSockets
- Rich text editing or file attachments
- Multi-user editing conflict resolution
- Deployment, CI/CD, or containerization
- Testing suite (unit/integration)

## Success Criteria

1. A user can create a task and see it appear in the task list
2. A user can change a task's status through all valid transitions (to_do → pending → in_progress → done)
3. Invalid transitions (e.g., to_do → done) are rejected by the backend
4. Updating to the same status does not create a duplicate audit log entry
5. Each task's audit log shows all status changes in chronological order with actor, old status, new status, and timestamp
6. Deleting a task removes it from the list
