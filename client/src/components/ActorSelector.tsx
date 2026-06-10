import { useState, useRef, useEffect } from 'react';
import { PREDEFINED_ACTORS, Actor } from '../types';

function getInitials(name: string): string {
  return name
    .split(/[.\s]/)
    .map((p) => p[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getDisplayName(actor: string): string {
  return actor
    .split(/[.\s]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

interface ActorSelectorProps {
  actor: Actor;
  onChange: (actor: Actor) => void;
}

export function ActorSelector({ actor, onChange }: ActorSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container-low cursor-pointer transition-all"
        onClick={() => setOpen(!open)}
      >
        <span className="material-symbols-outlined text-secondary">account_circle</span>
        <span className="text-body-md text-primary font-medium">{getDisplayName(actor)}</span>
        <span className="material-symbols-outlined text-secondary">arrow_drop_down</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-outline-variant">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Switch Actor
            </p>
          </div>
          {PREDEFINED_ACTORS.map((a) => {
            const isActive = a === actor;
            return (
              <button
                key={a}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-body-md text-left transition-colors cursor-pointer
                  ${isActive ? 'bg-secondary-container text-on-secondary-container font-semibold' : 'text-secondary hover:bg-surface-container-high'}
                `}
                onClick={() => {
                  onChange(a);
                  setOpen(false);
                }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${isActive ? 'bg-primary text-white' : 'bg-primary-container text-white'}
                  `}
                >
                  {getInitials(a)}
                </div>
                <span>{getDisplayName(a)}</span>
                {isActive && (
                  <span className="material-symbols-outlined ml-auto text-body-sm">check</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
