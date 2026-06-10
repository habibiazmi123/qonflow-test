import { PREDEFINED_ACTORS, Actor } from '../types';

interface ActorSelectorProps {
  actor: Actor;
  onChange: (actor: Actor) => void;
}

export function ActorSelector({ actor, onChange }: ActorSelectorProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-gray-600 font-medium">Actor:</span>
      <select
        value={actor}
        onChange={(e) => onChange(e.target.value as Actor)}
        className="px-2 py-1 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      >
        {PREDEFINED_ACTORS.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    </label>
  );
}
