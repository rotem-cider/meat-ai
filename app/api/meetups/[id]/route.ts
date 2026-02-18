import { NextRequest, NextResponse } from "next/server";
import { getDb, Meetup, Participant, RECOMMENDED_MEAT_PER_PERSON_LBS } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const meetup = db.prepare("SELECT * FROM meetups WHERE id = ?").get(id) as Meetup | undefined;

  if (!meetup) {
    return NextResponse.json({ error: "Meetup not found" }, { status: 404 });
  }

  const participants = db
    .prepare("SELECT * FROM participants WHERE meetup_id = ? ORDER BY created_at ASC")
    .all(id) as Participant[];

  const totalMeatLbs = participants.reduce((sum, p) => sum + p.meat_lbs, 0);
  const attendeeCount = participants.length;
  const recommendedMeatLbs = attendeeCount * RECOMMENDED_MEAT_PER_PERSON_LBS;
  const hosts = participants.filter((p) => p.can_host);

  const otherItems: { name: string; items: string }[] = participants
    .filter((p) => p.other_items.trim())
    .map((p) => ({ name: p.name, items: p.other_items }));

  return NextResponse.json({
    meetup,
    participants,
    stats: {
      totalMeatLbs,
      attendeeCount,
      recommendedMeatLbs,
      meatDiffLbs: totalMeatLbs - recommendedMeatLbs,
      hosts,
      otherItems,
    },
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM meetups WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
