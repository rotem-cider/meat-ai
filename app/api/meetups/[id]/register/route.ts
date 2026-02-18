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

  const existingResult = await db.execute({
    sql: "SELECT * FROM participants WHERE meetup_id = ? AND email = ?",
    args: [id, email],
  });
  const existing = existingResult.rows[0] as unknown as Participant | undefined;

  if (existing) {
    await db.execute({
      sql: "UPDATE participants SET name=?, can_host=?, meat_lbs=?, meat_type=?, other_items=? WHERE id=?",
      args: [name, can_host ? 1 : 0, meat_lbs || 0, meat_type || "", other_items || "", existing.id],
    });

    const updated = await db.execute({ sql: "SELECT * FROM participants WHERE id = ?", args: [existing.id] });
    return NextResponse.json(updated.rows[0] as unknown as Participant);
  }

  const result = await db.execute({
    sql: "INSERT INTO participants (meetup_id, name, email, can_host, meat_lbs, meat_type, other_items) VALUES (?, ?, ?, ?, ?, ?, ?)",
    args: [id, name, email, can_host ? 1 : 0, meat_lbs || 0, meat_type || "", other_items || ""],
  });

  const participant = await db.execute({
    sql: "SELECT * FROM participants WHERE id = ?",
    args: [result.lastInsertRowid!],
  });
  return NextResponse.json(participant.rows[0] as unknown as Participant, { status: 201 });
}
