# UI Context

## Theme

Light and functional. No dark mode required. The UI prioritizes clarity and readability over visual polish. The goal is to make task status and audit history immediately comprehensible.

## Design Principles

- Simplicity first — one page, one purpose
- Status is always visually prominent so users can scan the task list quickly
- Audit logs are accessible per task but not in the way of the main task list

## Layout

```
+---------------------------------------------+
|  Mini Task Manager                    [Actor ▼] |
+---------------------------------------------+
|  [New Task Button]                           |
+---------------------------------------------+
|  Task List                                   |
|  +-----------------------------------------+ |
|  | Task Title          Status    [Actions]  | |
|  | [View Audit Log ▲]                      | |
|  | ── audit entry 1                        | |
|  | ── audit entry 2                        | |
|  +-----------------------------------------+ |
|  | Task Title          Status    [Actions]  | |
|  +-----------------------------------------+ |
+---------------------------------------------+
```

## Component Structure

- **App**: Root — actor dropdown in header
- **TaskList**: Renders all tasks, each with expandable audit log section
- **TaskCard**: Single task row — title, status badge, action buttons (status transition, delete)
- **AuditLog**: Expandable section inside TaskCard — chronological list of entries
- **CreateTaskForm**: Modal or inline form for new task creation
- **ActorSelector**: Dropdown in header to pick the current actor

## Status Badges

Each status has a distinct visual style so users can distinguish them at a glance:

| Status       | Visual Cue                  | Tailwind Classes                |
| ------------ | --------------------------- | ------------------------------- |
| to_do        | Neutral / gray              | `bg-gray-200 text-gray-700`     |
| pending      | Warning / yellow            | `bg-amber-100 text-amber-800`   |
| in_progress  | Active / blue               | `bg-blue-100 text-blue-800`     |
| done         | Complete / green            | `bg-emerald-100 text-emerald-800`|

## Styling

- **Framework**: Tailwind v4 — no PostCSS, no config file. The `@tailwindcss/vite` plugin handles everything.
- **Design tokens**: Status badge colors and audit log highlight colors are defined in `index.css` using Tailwind v4's `@theme` directive. These become available as custom utilities (e.g., `bg-status-to-do`, `text-status-pending-text`).
- **No custom CSS**: All styling uses inline Tailwind utility classes. The only CSS file (`index.css`) contains the Tailwind import and `@theme` tokens.

## Colors

Status colors use Tailwind's built-in palette. Custom tokens are defined via `@theme` in `index.css`:

| Token                     | Value    | Usage                      |
| ------------------------- | -------- | -------------------------- |
| `--color-status-to-do`      | `#e5e7eb` | Badge background (to_do)   |
| `--color-status-to-do-text` | `#374151` | Badge text (to_do)         |
| `--color-status-pending`      | `#fef3c7` | Badge background (pending) |
| `--color-status-pending-text` | `#92400e` | Badge text (pending)       |
| `--color-status-in-progress`      | `#dbeafe` | Badge background (in_progress) |
| `--color-status-in-progress-text`  | `#1e40af` | Badge text (in_progress)   |
| `--color-status-done`      | `#d1fae5` | Badge background (done)    |
| `--color-status-done-text` | `#065f46` | Badge text (done)          |
| `--color-audit-from`       | `#fee2e2` | From-status highlight      |
| `--color-audit-from-text`  | `#991b1b` | From-status text           |
| `--color-audit-to`         | `#d1fae5` | To-status highlight        |
| `--color-audit-to-text`    | `#065f46` | To-status text             |

## Typography

- System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...`)
- Sizes: Tailwind's default scale — `text-xs` (0.75rem), `text-sm` (0.875rem), `text-base` (1rem), `text-xl` (1.25rem)

## Component Library

No external UI library. All components use Tailwind utility classes directly.

## Responsiveness

Not a priority. Assume desktop viewport (~1024px+). The app should be usable but not production-ready on mobile.

## Icons

Optional. Not required for the evaluation. Simple text labels are sufficient.
