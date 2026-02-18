import MeetupDashboard from "@/app/components/MeetupDashboard";
import { getDb, Meetup } from "@/lib/db";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const db = getDb();
  const meetup = db.prepare("SELECT * FROM meetups WHERE id = ?").get(id) as Meetup | undefined;

  if (!meetup) {
    return { title: "Meetup Not Found — Meat & AI" };
  }

  const eventDate = new Date(meetup.proposed_date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const title = `${meetup.title} — Meat & AI`;
  const description = meetup.description
    ? `${meetup.description} · ${formattedDate}`
    : `Join us on ${formattedDate}. RSVP, bring some meat, talk some AI.`;

  return {
    title,
    description,
    openGraph: {
      title: meetup.title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meetup.title,
      description,
    },
  };
}

export default async function MeetupPage({ params }: Props) {
  const { id } = await params;
  const meetupId = parseInt(id, 10);

  if (isNaN(meetupId)) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <p className="text-zinc-500">Invalid meetup ID.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <MeetupDashboard meetupId={meetupId} />
    </div>
  );
}
