import { NextRequest, NextResponse } from "next/server";
import { getDb, Participant } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const hosts = db
    .prepare("SELECT * FROM participants WHERE meetup_id = ? AND can_host = 1")
    .all(id) as Participant[];

  if (hosts.length === 0) {
    return NextResponse.json({ error: "No hosts available" }, { status: 404 });
  }

  const randomIndex = Math.floor(Math.random() * hosts.length);
  return NextResponse.json({ hosts, selectedHost: hosts[randomIndex] });
}
