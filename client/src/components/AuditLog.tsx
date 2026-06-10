import { AuditLogEntry } from '../types';

interface AuditLogProps {
  logs: AuditLogEntry[];
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function AuditLog({ logs }: AuditLogProps) {
  if (logs.length === 0) {
    return (
      <p className="text-body-sm text-on-surface-variant italic">
        No changes recorded yet.
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {logs.map((entry, i) => {
        const isLast = i === logs.length - 1;
        return (
          <div key={entry.id} className="flex gap-4">
            {/* Timeline column */}
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-primary shrink-0 mt-1.5" />
              {!isLast && <div className="w-px flex-1 bg-outline-variant" />}
            </div>
            {/* Content */}
            <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
              <span className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
                {formatTimestamp(entry.timestamp)}
              </span>
              <p className="text-body-sm text-on-surface mt-0.5">
                <span className="font-semibold text-primary">{entry.actor}</span>
                {' changed status from '}
                <span className="inline-block px-1.5 py-0.5 rounded text-label-sm font-semibold bg-audit-from text-audit-from-text">
                  {entry.fromStatus}
                </span>
                {' → '}
                <span className="inline-block px-1.5 py-0.5 rounded text-label-sm font-semibold bg-audit-to text-audit-to-text">
                  {entry.toStatus}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
