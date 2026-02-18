import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  const { participantId } = await params;
  const db = getDb();
  db.prepare("DELETE FROM participants WHERE id = ?").run(participantId);
  return NextResponse.json({ ok: true });
}
