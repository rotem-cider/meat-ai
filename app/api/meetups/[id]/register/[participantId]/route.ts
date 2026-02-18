import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  const { participantId } = await params;
  const db = getDb();
  await db.execute({ sql: "DELETE FROM participants WHERE id = ?", args: [participantId] });
  return NextResponse.json({ ok: true });
}
