"use client";

import { useState, FormEvent } from "react";

interface CreateMeetupProps {
  onCreated: (meetupId: number) => void;
}

export default function CreateMeetup({ onCreated }: CreateMeetupProps) {
  const [title, setTitle] = useState("Meat & AI Meetup");
  const [date, setDate] = useState(() => {
    const now = new Date();
    now.setDate(now.getDate() + 7);
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T20:00`;
  });
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/meetups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          proposed_date: date,
          location: location.trim(),
          description: description.trim(),
        }),
      });
      const created = await res.json();
      onCreated(created.id);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900">Propose a Meetup</h3>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Proposed Date</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Location (optional)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            placeholder="TBD — depends on host"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            placeholder="What's the plan? AI demos? Smoked brisket? Both?"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-4 w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 font-semibold text-white shadow-md transition-all hover:from-orange-600 hover:to-red-600 hover:shadow-lg disabled:opacity-50"
      >
        {submitting ? "Creating..." : "Propose Meetup 🔥"}
      </button>
    </form>
  );
}
