import { NextResponse } from "next/server";
import { readDb, mutate } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import type { Leader } from "@/lib/types";

export async function GET() {
  const db = await readDb();
  const list = [...db.leadership].sort((a, b) => a.order - b.order);
  return NextResponse.json(list);
}

export async function PUT(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const list = (await request.json().catch(() => [])) as Leader[];
  await mutate((db) => {
    db.leadership = list.map((l, i) => ({
      id: l.id || Math.random().toString(36).slice(2, 10),
      name: String(l.name || "").slice(0, 120),
      rank: String(l.rank || "").slice(0, 160),
      photo: String(l.photo || ""),
      bio: String(l.bio || "").slice(0, 1000),
      order: i + 1,
    }));
  });
  return NextResponse.json({ ok: true });
}
