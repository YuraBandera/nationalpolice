import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { readDb, mutate } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import type { Unit } from "@/lib/types";

export async function GET() {
  const db = await readDb();
  const list = [...db.units].sort((a, b) => a.order - b.order);
  return NextResponse.json(list);
}

export async function PUT(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const list = (await request.json().catch(() => [])) as Unit[];
  await mutate((db) => {
    db.units = list.map((u, i) => ({
      id: u.id || Math.random().toString(36).slice(2, 10),
      name: String(u.name || "").slice(0, 160),
      short: String(u.short || "").slice(0, 200),
      description: String(u.description || "").slice(0, 2000),
      icon: String(u.icon || "shield").slice(0, 40),
      order: i + 1,
    }));
  });
  return NextResponse.json({ ok: true });
}
