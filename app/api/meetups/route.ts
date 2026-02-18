import { NextRequest, NextResponse } from "next/server";
import { getDb, Meetup } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const meetups = db.prepare("SELECT * FROM meetups ORDER BY created_at DESC").all() as Meetup[];
  return NextResponse.json(meetups);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, proposed_date, location, description } = body;

  if (!title || !proposed_date) {
    return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
  }

  const db = getDb();
  const result = db
    .prepare("INSERT INTO meetups (title, proposed_date, location, description) VALUES (?, ?, ?, ?)")
    .run(title, proposed_date, location || "", description || "");

  const meetup = db.prepare("SELECT * FROM meetups WHERE id = ?").get(result.lastInsertRowid) as Meetup;
  return NextResponse.json(meetup, { status: 201 });
}
