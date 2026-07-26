import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { readDb, mutate, uid } from "@/lib/db";
import { currentInvestigator } from "@/lib/erdrAuth";
import type { ErdrCase } from "@/lib/types";

/** Генерує 17-значний номер ЄРДР. */
function makeNumber(seq: number): string {
  const year = new Date().getFullYear();
  return `126${year}${String(seq).padStart(10, "0")}`;
}

export async function GET() {
  const inv = await currentInvestigator();
  if (!inv) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const db = await readDb();
  // повертаємо всі провадження, найновіші зверху
  const list = [...db.erdr].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const inv = await currentInvestigator();
  if (!inv) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const b = await request.json().catch(() => ({}));

  const articles = Array.isArray(b.articles)
    ? b.articles.map((a: unknown) => String(a)).filter(Boolean).slice(0, 20)
    : [];
  if (articles.length === 0) {
    return NextResponse.json({ error: "Вкажіть хоча б одну статтю ККУ." }, { status: 400 });
  }
  if (String(b.fabula || "").trim().length < 10) {
    return NextResponse.json({ error: "Опишіть фабулу (мінімум 10 символів)." }, { status: 400 });
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
      status: "registered",
      investigatorId: inv.id,
      source: "police",
      signature: String(b.signature || "").slice(0, 400),
      entries: [
        { id: uid(), text: "Провадження зареєстровано", author: inv.name || inv.login, at: now },
      ],
      createdAt: now,
      updatedAt: now,
    };
    d.erdr.unshift(c);
    created = c;
  });
  return NextResponse.json({ ok: true, case: created });
}
