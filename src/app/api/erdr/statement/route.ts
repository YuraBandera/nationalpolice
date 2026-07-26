import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { mutate, uid } from "@/lib/db";
import { clientIp, checkSpam, looksLikeBot } from "@/lib/antispam";
import { checkRobloxExists } from "@/lib/roblox";
import type { ErdrCase } from "@/lib/types";

function makeNumber(seq: number): string {
  const year = new Date().getFullYear();
  return `126${year}${String(seq).padStart(10, "0")}`;
}

const req = (v: unknown) => typeof v === "string" && v.trim().length > 0;

export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}));

  if (looksLikeBot(b)) return NextResponse.json({ ok: true, number: "" });

  if (!req(b.applicant) || !req(b.fabula)) {
    return NextResponse.json({ error: "Заповніть обов'язкові поля." }, { status: 400 });
  }
  if (String(b.fabula).trim().length < 15) {
    return NextResponse.json(
      { error: "Опишіть подію докладніше (мінімум 15 символів)." },
      { status: 400 }
    );
  }

  // Перевірка Roblox-ніків: блокуємо лише якщо API точно каже "немає"
  const applicantCheck = await checkRobloxExists(String(b.applicant));
  if (applicantCheck === "not_found") {
    return NextResponse.json(
      { error: "Ваш Roblox-нік не знайдено. Перевірте, чи правильно введено." },
      { status: 400 }
    );
  }
  if (req(b.suspect)) {
    const suspectCheck = await checkRobloxExists(String(b.suspect));
    if (suspectCheck === "not_found") {
      return NextResponse.json(
        { error: "Roblox-нік підозрюваного не знайдено. Перевірте, чи правильно введено." },
        { status: 400 }
      );
    }
  }

  // Антиспам + кулдаун 5 хв
  const ip = clientIp(request);
  const spam = checkSpam(ip, {
    minGapMs: 5 * 60_000,
    max: 6,
    windowMs: 60 * 60_000,
    dupText: String(b.fabula),
  });
  if (!spam.ok) return NextResponse.json({ error: spam.reason }, { status: 429 });

  const now = new Date().toISOString();
  let created: ErdrCase | null = null;
  await mutate((d) => {
    const c: ErdrCase = {
      id: uid(),
      number: makeNumber(d.erdr.length + 1),
      articles: [],
      fabula: String(b.fabula).slice(0, 5000),
      applicant: String(b.applicant).slice(0, 60),
      suspect: String(b.suspect || "").slice(0, 60),
      fullName: String(b.fullName || "").slice(0, 160),
      court: String(b.court || "").slice(0, 200),
      eventDate: String(b.eventDate || "").slice(0, 120),
      eventPlace: String(b.eventPlace || "").slice(0, 200),
      witnesses: String(b.witnesses || "").slice(0, 400),
      evidence: String(b.evidence || "").slice(0, 500),
      status: "registered",
      investigatorId: "",
      source: "citizen",
      signature: "",
      applicantSignature: String(b.applicantSignature || "").slice(0, 400),
      entries: [{ id: uid(), text: "Заяву прийнято від громадянина", author: "Система", at: now }],
      createdAt: now,
      updatedAt: now,
    };
    d.erdr.unshift(c);
    created = c;
  });

  return NextResponse.json({ ok: true, number: created!.number });
}
