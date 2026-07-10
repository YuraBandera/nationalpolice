import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { readDb, mutate } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import type { ApplicationQuestion } from "@/lib/types";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.applicationQuestions);
}

export async function PUT(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const list = (await request.json().catch(() => [])) as ApplicationQuestion[];
  await mutate((db) => {
    db.applicationQuestions = list
      .filter((q) => String(q.label || "").trim().length > 0)
      .map((q) => ({
        id: q.id || Math.random().toString(36).slice(2, 10),
        label: String(q.label).slice(0, 200),
        type: q.type === "long" ? "long" : "short",
        required: Boolean(q.required),
      }));
  });
  return NextResponse.json({ ok: true });
}
