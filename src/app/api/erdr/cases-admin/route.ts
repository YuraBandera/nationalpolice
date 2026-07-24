import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { readDb } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const db = await readDb();
  const list = [...db.erdr]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((c) => ({
      id: c.id,
      number: c.number,
      articles: c.articles,
      status: c.status,
      source: c.source,
      applicant: c.applicant,
      suspect: c.suspect,
      createdAt: c.createdAt,
    }));
  return NextResponse.json(list);
}
