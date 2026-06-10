import { AuditLogEntry } from '../types';

interface AuditLogProps {
  logs: AuditLogEntry[];
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString();
}

export function AuditLog({ logs }: AuditLogProps) {
  if (logs.length === 0) {
    return <p className="text-sm italic text-gray-400">No changes recorded yet.</p>;
  }

  return (
    <ul className="list-none">
      {logs.map((entry) => (
        <li
          key={entry.id}
          className="text-sm py-1.5 border-b border-gray-100 text-gray-700 last:border-b-0"
        >
          <span className="font-semibold text-gray-900">{entry.actor}</span>
          {' changed status from '}
          <span className="inline-block px-1.5 py-0.5 rounded text-xs font-semibold bg-audit-from text-audit-from-text">
            {entry.fromStatus}
          </span>
          {' → '}
          <span className="inline-block px-1.5 py-0.5 rounded text-xs font-semibold bg-audit-to text-audit-to-text">
            {entry.toStatus}
          </span>
          <span className="block text-xs text-gray-400 mt-0.5">
            {formatTimestamp(entry.timestamp)}
          </span>
        </li>
      ))}
    </ul>
  );
}
