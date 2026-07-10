import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { readDb, mutate, uid } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import { notifyComplaint } from "@/lib/discord";
import type { Complaint } from "@/lib/types";

const req = (v: unknown) => typeof v === "string" && v.trim().length > 0;

export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}));
  if (!req(b.discord) || !req(b.against) || !req(b.description)) {
    return NextResponse.json({ error: "Заповніть обов'язкові поля" }, { status: 400 });
  }
  const c: Complaint = {
    id: uid(),
    discord: String(b.discord).slice(0, 80),
    nickname: String(b.nickname || "").slice(0, 80),
    against: String(b.against).slice(0, 120),
    unit: String(b.unit || "").slice(0, 120),
    date: String(b.date || "").slice(0, 40),
    description: String(b.description).slice(0, 5000),
    evidence: String(b.evidence || "").slice(0, 2000),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  await mutate((db) => db.complaints.unshift(c));
  await notifyComplaint(c);
  return NextResponse.json({ ok: true, id: c.id });
}

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const db = await readDb();
  return NextResponse.json(db.complaints);
}

export async function PATCH(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const { id, status } = await request.json().catch(() => ({}));
  await mutate((db) => {
    const c = db.complaints.find((x) => x.id === id);
    if (c) c.status = status;
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const { id } = await request.json().catch(() => ({}));
  await mutate((db) => {
    db.complaints = db.complaints.filter((x) => x.id !== id);
  });
  return NextResponse.json({ ok: true });
}
