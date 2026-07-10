import { NextResponse } from "next/server";
import { readDb, mutate } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import type { StatItem } from "@/lib/types";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.stats);
}

export async function PUT(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const list = (await request.json().catch(() => [])) as StatItem[];
  await mutate((db) => {
    db.stats = list.map((s) => ({
      id: s.id || Math.random().toString(36).slice(2, 10),
      label: String(s.label || "").slice(0, 80),
      value: Number(s.value) || 0,
      suffix: String(s.suffix || "").slice(0, 8),
    }));
  });
  return NextResponse.json({ ok: true });
}
