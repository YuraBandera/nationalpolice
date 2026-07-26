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
      status: STATUSES.includes(b.status) ? b.status : "registered",
      investigatorId: "",
      source: "police",
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
