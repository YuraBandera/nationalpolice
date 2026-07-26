import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { readDb, mutate, uid } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import type { ErdrCase, ErdrStatus } from "@/lib/types";

const STATUSES: ErdrStatus[] = ["registered", "investigating", "suspended", "court", "closed"];

function makeNumber(seq: number): string {
  const year = new Date().getFullYear();
  return `126${year}${String(seq).padStart(10, "0")}`;
}

// повний перегляд (з журналом) — для адміна
export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const db = await readDb();
  const list = [...db.erdr].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return NextResponse.json(list);
}

// створення провадження адміном
export async function POST(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  const articles = Array.isArray(b.articles)
    ? b.articles.map((a: unknown) => String(a)).filter(Boolean).slice(0, 20)
    : [];
  if (String(b.fabula || "").trim().length < 5) {
    return NextResponse.json({ error: "Вкажіть фабулу." }, { status: 400 });
  }
  const now = new Date().toISOString();
  let created: ErdrCase | null = null;
  await mutate((d) => {
    const c: ErdrCase = {
      id: uid(),
      number: makeNumber(d.erdr.length + 1),
      articles,
      fabula: String(b.fabula).slice(0, 5000),
      applicant: String(b.applicant || "").slice(0, 60),
      suspect: String(b.suspect || "").slice(0, 60),
      fullName: String(b.fullName || "").slice(0, 160),
      court: String(b.court || "").slice(0, 200),
      eventDate: String(b.eventDate || "").slice(0, 120),
      eventPlace: String(b.eventPlace || "").slice(0, 200),
      witnesses: String(b.witnesses || "").slice(0, 400),
      evidence: String(b.evidence || "").slice(0, 500),
      status: STATUSES.includes(b.status) ? b.status : "registered",
      investigatorId: "",
      source: "police",
      signature: String(b.signature || "").slice(0, 400),
      applicantSignature: String(b.applicantSignature || "").slice(0, 400),
      entries: [{ id: uid(), text: "Провадження створено адміністратором", author: "Адміністратор", at: now }],
      createdAt: now,
      updatedAt: now,
    };
    d.erdr.unshift(c);
    created = c;
  });
  return NextResponse.json({ ok: true, case: created });
}

// оновлення будь-якого поля адміном
export async function PATCH(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  const id = String(b.id || "");
  const now = new Date().toISOString();
  let found = false;
  await mutate((d) => {
    const c = d.erdr.find((x) => x.id === id);
    if (!c) return;
    found = true;
    if (typeof b.status === "string" && STATUSES.includes(b.status as ErdrStatus)) {
      if (c.status !== b.status) {
        c.entries.push({ id: uid(), text: `Статус змінено: ${b.status}`, author: "Адміністратор", at: now });
      }
      c.status = b.status as ErdrStatus;
    }
    if (Array.isArray(b.articles)) {
      c.articles = b.articles.map((a: unknown) => String(a)).filter(Boolean).slice(0, 20);
    }
    if (typeof b.fabula === "string") c.fabula = b.fabula.slice(0, 5000);
    if (typeof b.applicant === "string") c.applicant = b.applicant.slice(0, 60);
    if (typeof b.suspect === "string") c.suspect = b.suspect.slice(0, 60);
    if (typeof b.fullName === "string") c.fullName = b.fullName.slice(0, 160);
    if (typeof b.court === "string") c.court = b.court.slice(0, 200);
    if (typeof b.eventDate === "string") c.eventDate = b.eventDate.slice(0, 120);
    if (typeof b.eventPlace === "string") c.eventPlace = b.eventPlace.slice(0, 200);
    if (typeof b.witnesses === "string") c.witnesses = b.witnesses.slice(0, 400);
    if (typeof b.evidence === "string") c.evidence = b.evidence.slice(0, 500);
    if (typeof b.signature === "string") c.signature = b.signature.slice(0, 400);
    if (typeof b.applicantSignature === "string") c.applicantSignature = b.applicantSignature.slice(0, 400);
    if (typeof b.entry === "string" && b.entry.trim()) {
      c.entries.push({ id: uid(), text: b.entry.slice(0, 2000), author: "Адміністратор", at: now });
    }
    c.updatedAt = now;
  });
  if (!found) return NextResponse.json({ error: "Провадження не знайдено" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

// видалення провадження
export async function DELETE(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const { id } = await request.json().catch(() => ({}));
  await mutate((d) => {
    d.erdr = d.erdr.filter((x) => x.id !== id);
  });
  return NextResponse.json({ ok: true });
}
