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
  onEdit: (participant: Participant) => void;
}

export default function ParticipantList({ participants, onRemove, onEdit }: ParticipantListProps) {
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
              {String(p.name).charAt(0).toUpperCase()}
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
                {Number(p.meat_lbs) > 0 && (
                  <span>
                    🥩 {p.meat_lbs} lbs {p.meat_type}
                  </span>
                )}
                {p.other_items && <span>📦 {p.other_items}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
              <button
                onClick={() => onEdit(p)}
                className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
                title="Edit"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={() => onRemove(p.id)}
                className="rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
