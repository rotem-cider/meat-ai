"use client";

import { useState, useEffect, FormEvent } from "react";

interface EditingParticipant {
  id: number;
  name: string;
  email: string;
  can_host: number;
  meat_lbs: number;
  meat_type: string;
  other_items: string;
}

interface RegisterFormProps {
  meetupId: number;
  onRegistered: () => void;
  editing?: EditingParticipant | null;
  onCancelEdit?: () => void;
}

export default function RegisterForm({ meetupId, onRegistered, editing, onCancelEdit }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [canHost, setCanHost] = useState(false);
  const [meatLbs, setMeatLbs] = useState("");
  const [meatType, setMeatType] = useState("");
  const [otherItems, setOtherItems] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setEmail(editing.email);
      setCanHost(editing.can_host === 1);
      setMeatLbs(editing.meat_lbs > 0 ? String(editing.meat_lbs) : "");
      setMeatType(editing.meat_type || "");
      setOtherItems(editing.other_items || "");
    }
  }, [editing]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setCanHost(false);
    setMeatLbs("");
    setMeatType("");
    setOtherItems("");
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/meetups/${meetupId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          can_host: canHost,
          meat_lbs: parseFloat(meatLbs) || 0,
          meat_type: meatType.trim(),
          other_items: otherItems.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      resetForm();
      onRegistered();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit?.();
  };

  const isEditing = !!editing;

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900">
          {isEditing ? "Update Registration" : "Sign Up"}
        </h3>
        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              placeholder="john@example.com"
              required
              disabled={isEditing}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
          <input
            type="checkbox"
            id="canHost"
            checked={canHost}
            onChange={(e) => setCanHost(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-orange-600 focus:ring-orange-500"
          />
          <label htmlFor="canHost" className="text-sm font-medium text-amber-800 cursor-pointer">
            I can host this meetup at my place! 🏠
          </label>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">Bringing Meat?</label>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <input
                type="number"
                value={meatLbs}
                onChange={(e) => setMeatLbs(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="Pounds (e.g. 2.5)"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <input
                type="text"
                value={meatType}
                onChange={(e) => setMeatType(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="Type (e.g. Ribeye, Brisket)"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Other Items (beers, drinks, snacks, sides...)
          </label>
          <input
            type="text"
            value={otherItems}
            onChange={(e) => setOtherItems(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            placeholder="e.g. 12-pack IPA, chips & salsa, coleslaw"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 font-semibold text-white shadow-md transition-all hover:from-orange-600 hover:to-red-600 hover:shadow-lg disabled:opacity-50"
      >
        {submitting
          ? isEditing ? "Updating..." : "Signing up..."
          : isEditing ? "Update My Info" : "I'm In! 🔥"}
      </button>
    </form>
  );
}
