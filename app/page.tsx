"use client";

import { useState, useEffect, useCallback } from "react";
import CreateMeetup from "./components/CreateMeetup";
import MeetupDashboard from "./components/MeetupDashboard";

interface Meetup {
  id: number;
  title: string;
  proposed_date: string;
  location: string;
  description: string;
  created_at: string;
}

export default function Home() {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [selectedMeetupId, setSelectedMeetupId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMeetups = useCallback(async () => {
    try {
      const res = await fetch("/api/meetups");
      const data = await res.json();
      setMeetups(data);
      if (data.length === 1 && !selectedMeetupId) {
        setSelectedMeetupId(data[0].id);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedMeetupId]);

  useEffect(() => {
    fetchMeetups();
  }, [fetchMeetups]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
      </div>
    );
  }

  if (selectedMeetupId) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <MeetupDashboard
          meetupId={selectedMeetupId}
          onBack={() => {
            setSelectedMeetupId(null);
            fetchMeetups();
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 sm:text-5xl">
          Meat & AI
        </h1>
        <p className="mt-3 text-lg text-zinc-500">
          Where good code meets great cuts. Propose a meetup, bring some meat, talk some AI.
        </p>
      </div>

      {meetups.length > 0 && (
        <div className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-zinc-800">Upcoming Meetups</h2>
          {meetups.map((m) => {
            const d = new Date(m.proposed_date);
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMeetupId(m.id)}
                className="w-full rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition-all hover:border-orange-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900">{m.title}</h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {d.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at{" "}
                      {d.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                      {m.location && ` · ${m.location}`}
                    </p>
                  </div>
                  <span className="text-2xl">→</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {showCreate ? (
        <CreateMeetup
          onCreated={() => {
            setShowCreate(false);
            fetchMeetups();
          }}
        />
      ) : (
        <button
          onClick={() => setShowCreate(true)}
          className="w-full rounded-2xl border-2 border-dashed border-zinc-300 bg-white p-8 text-center transition-all hover:border-orange-400 hover:bg-orange-50"
        >
          <span className="text-3xl">🔥</span>
          <p className="mt-2 text-lg font-semibold text-zinc-700">Propose Next Meetup</p>
          <p className="mt-1 text-sm text-zinc-500">Pick a date and let people sign up</p>
        </button>
      )}
    </div>
  );
}
