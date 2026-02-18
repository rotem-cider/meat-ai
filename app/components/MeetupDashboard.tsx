"use client";

import { useState, useEffect, useCallback } from "react";
import MeatMeter from "./MeatMeter";
import HostSelector from "./HostSelector";
import OtherItems from "./OtherItems";
import ParticipantList from "./ParticipantList";
import RegisterForm from "./RegisterForm";
import ShareButton from "./ShareButton";
import Link from "next/link";

interface Meetup {
  id: number;
  title: string;
  proposed_date: string;
  location: string;
  description: string;
}

interface Participant {
  id: number;
  name: string;
  email: string;
  can_host: number;
  meat_lbs: number;
  meat_type: string;
  other_items: string;
}

interface Stats {
  totalMeatLbs: number;
  attendeeCount: number;
  recommendedMeatLbs: number;
  meatDiffLbs: number;
  hosts: Participant[];
  otherItems: { name: string; items: string }[];
}

interface MeetupDashboardProps {
  meetupId: number;
}

export default function MeetupDashboard({ meetupId }: MeetupDashboardProps) {
  const [meetup, setMeetup] = useState<Meetup | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/meetups/${meetupId}`);
      if (!res.ok) return;
      const data = await res.json();
      setMeetup(data.meetup);
      setParticipants(data.participants);
      setStats(data.stats);
    } finally {
      setLoading(false);
    }
  }, [meetupId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRemove = async (participantId: number) => {
    await fetch(`/api/meetups/${meetupId}/register/${participantId}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
      </div>
    );
  }

  if (!meetup) {
    return <p className="text-center text-zinc-500">Meetup not found.</p>;
  }

  const eventDate = new Date(meetup.proposed_date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const meatByType: Record<string, number> = {};
  participants.forEach((p) => {
    if (p.meat_lbs > 0 && p.meat_type) {
      const key = p.meat_type.toLowerCase();
      meatByType[key] = (meatByType[key] || 0) + p.meat_lbs;
    }
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          <span>←</span> All meetups
        </Link>
        <ShareButton
          meetupId={meetupId}
          title={meetup.title}
          date={formattedDate}
        />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">{meetup.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-zinc-600">
          <span className="flex items-center gap-1.5">
            <span>📅</span> {formattedDate} at {formattedTime}
          </span>
          {meetup.location && (
            <span className="flex items-center gap-1.5">
              <span>📍</span> {meetup.location}
            </span>
          )}
        </div>
        {meetup.description && (
          <p className="mt-3 text-zinc-600">{meetup.description}</p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {stats && (
            <MeatMeter
              totalLbs={stats.totalMeatLbs}
              recommendedLbs={stats.recommendedMeatLbs}
              attendeeCount={stats.attendeeCount}
            />
          )}

          {Object.keys(meatByType).length > 0 && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-zinc-900">Meat Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(meatByType)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, lbs]) => (
                    <div key={type} className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
                      <span className="text-sm font-medium capitalize text-zinc-700">{type}</span>
                      <span className="text-sm font-semibold text-zinc-900">{lbs.toFixed(1)} lbs</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {stats && stats.otherItems.length > 0 && <OtherItems items={stats.otherItems} />}

          {stats && <HostSelector hosts={stats.hosts} meetupId={meetupId} />}
        </div>

        <div className="space-y-6">
          <RegisterForm meetupId={meetupId} onRegistered={fetchData} />
          <ParticipantList participants={participants} onRemove={handleRemove} />
        </div>
      </div>
    </div>
  );
}
