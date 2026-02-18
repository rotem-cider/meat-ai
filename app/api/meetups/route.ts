import { NextRequest, NextResponse } from "next/server";
import { getDb, Meetup } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const result = await db.execute("SELECT * FROM meetups ORDER BY created_at DESC");
  return NextResponse.json(result.rows as unknown as Meetup[]);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, proposed_date, location, description } = body;

  if (!title || !proposed_date) {
    return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
  }

  const db = getDb();
  const result = await db.execute({
    sql: "INSERT INTO meetups (title, proposed_date, location, description) VALUES (?, ?, ?, ?)",
    args: [title, proposed_date, location || "", description || ""],
  });

  const meetup = await db.execute({
    sql: "SELECT * FROM meetups WHERE id = ?",
    args: [result.lastInsertRowid!],
  });

  return NextResponse.json(meetup.rows[0] as unknown as Meetup, { status: 201 });
}
