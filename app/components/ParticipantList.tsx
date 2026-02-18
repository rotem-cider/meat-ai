"use client";

interface Participant {
  id: number;
  name: string;
  email: string;
  can_host: number;
  meat_lbs: number;
  meat_type: string;
  other_items: string;
}

interface ParticipantListProps {
  participants: Participant[];
  onRemove: (id: number) => void;
}

export default function ParticipantList({ participants, onRemove }: ParticipantListProps) {
  if (participants.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
        <p className="text-lg text-zinc-400">No one has signed up yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-zinc-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-zinc-900">
          Attendees ({participants.length})
        </h3>
      </div>
      <div className="divide-y divide-zinc-100">
        {participants.map((p) => (
          <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 transition-colors group">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-sm font-bold text-white">
              {p.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-zinc-900">{p.name}</span>
                {p.can_host === 1 && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Can Host
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                {p.meat_lbs > 0 && (
                  <span>
                    🥩 {p.meat_lbs} lbs {p.meat_type}
                  </span>
                )}
                {p.other_items && <span>📦 {p.other_items}</span>}
              </div>
            </div>
            <button
              onClick={() => onRemove(p.id)}
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all text-sm"
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
