import { NextRequest, NextResponse } from "next/server";
import { getDb, Participant } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, email, can_host, meat_lbs, meat_type, other_items } = body;

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const db = getDb();

  const existing = db
    .prepare("SELECT * FROM participants WHERE meetup_id = ? AND email = ?")
    .get(id, email) as Participant | undefined;

  if (existing) {
    db.prepare(
      "UPDATE participants SET name=?, can_host=?, meat_lbs=?, meat_type=?, other_items=? WHERE id=?"
    ).run(name, can_host ? 1 : 0, meat_lbs || 0, meat_type || "", other_items || "", existing.id);

    const updated = db.prepare("SELECT * FROM participants WHERE id = ?").get(existing.id) as Participant;
    return NextResponse.json(updated);
  }

  const result = db
    .prepare(
      "INSERT INTO participants (meetup_id, name, email, can_host, meat_lbs, meat_type, other_items) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(id, name, email, can_host ? 1 : 0, meat_lbs || 0, meat_type || "", other_items || "");

  const participant = db.prepare("SELECT * FROM participants WHERE id = ?").get(result.lastInsertRowid) as Participant;
  return NextResponse.json(participant, { status: 201 });
}
