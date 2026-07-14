import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { readDb, mutate, uid } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import { notifyComplaint } from "@/lib/discord";
import { clientIp, checkSpam, looksLikeBot } from "@/lib/antispam";
import type { Complaint } from "@/lib/types";

const req = (v: unknown) => typeof v === "string" && v.trim().length > 0;

export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}));

  // 1) Пастка для ботів / миттєве надсилання — тихо вдаємо успіх, нічого не зберігаємо
  if (looksLikeBot(b)) {
    return NextResponse.json({ ok: true, id: "skipped" });
  }

  // 2) Обов'язкові поля
  if (!req(b.discord) || !req(b.robloxSelf) || !req(b.robloxTarget) || !req(b.description)) {
    return NextResponse.json({ error: "Заповніть обов'язкові поля" }, { status: 400 });
  }

  // 3) Змістовність — надто короткий опис відсіюємо
  if (String(b.description).trim().length < 15) {
    return NextResponse.json(
      { error: "Опишіть ситуацію докладніше (мінімум 15 символів)." },
      { status: 400 }
    );
  }

  // 4) Ліміт за IP + захист від дублів
  const ip = clientIp(request);
  const spam = checkSpam(ip, {
    minGapMs: 20_000,
    max: 6,
    windowMs: 60 * 60_000,
    dupText: String(b.description),
  });
  if (!spam.ok) {
    return NextResponse.json({ error: spam.reason }, { status: 429 });
  }

  const c: Complaint = {
    id: uid(),
    discord: String(b.discord).slice(0, 80),
    nickname: String(b.nickname || "").slice(0, 80),
    robloxSelf: String(b.robloxSelf || "").slice(0, 60),
    robloxTarget: String(b.robloxTarget || "").slice(0, 60),
    against: String(b.against || b.robloxTarget || "").slice(0, 120),
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
