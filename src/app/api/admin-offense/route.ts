import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { clientIp, checkSpam, looksLikeBot } from "@/lib/antispam";
import { checkRobloxExists } from "@/lib/roblox";
import { notifyAdminOffense } from "@/lib/discord";
import { kupapTitle, kupapPunishment } from "@/lib/kupapArticles";

const req = (v: unknown) => typeof v === "string" && v.trim().length > 0;

export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}));

  if (looksLikeBot(b)) return NextResponse.json({ ok: true });

  // Обов'язкові: свій нік, нік порушника, номер ТЗ, стаття, доказ
  if (!req(b.applicant) || !req(b.offender) || !req(b.vehicle) || !req(b.article) || !req(b.evidence)) {
    return NextResponse.json(
      { error: "Заповніть обов'язкові поля: ваш нік, нік порушника, номер ТЗ, стаття та доказ." },
      { status: 400 }
    );
  }

  const title = kupapTitle(String(b.article));
  if (!title) {
    return NextResponse.json({ error: "Оберіть коректну статтю КУпАП." }, { status: 400 });
  }

  // Перевірка Roblox-ніків (блок лише якщо точно немає)
  const [selfChk, offChk] = await Promise.all([
    checkRobloxExists(String(b.applicant)),
    checkRobloxExists(String(b.offender)),
  ]);
  if (selfChk === "not_found") {
    return NextResponse.json({ error: "Ваш Roblox-нік не знайдено." }, { status: 400 });
  }
  if (offChk === "not_found") {
    return NextResponse.json({ error: "Roblox-нік порушника не знайдено." }, { status: 400 });
  }

  // Антиспам + кулдаун 5 хв
  const spam = checkSpam(clientIp(request), {
    scope: "offense",
    minGapMs: 5 * 60_000,
    max: 8,
    windowMs: 60 * 60_000,
    dupText: `${b.vehicle}|${b.offender}|${b.evidence}`,
  });
  if (!spam.ok) return NextResponse.json({ error: spam.reason }, { status: 429 });

  await notifyAdminOffense({
    applicant: String(b.applicant).slice(0, 60),
    offender: String(b.offender).slice(0, 60),
    vehicle: String(b.vehicle).slice(0, 40),
    article: String(b.article).slice(0, 20),
    articleTitle: title,
    punishment: kupapPunishment(String(b.article)),
    place: String(b.place || "").slice(0, 200),
    when: String(b.when || "").slice(0, 120),
    circumstances: String(b.circumstances || "").slice(0, 3000),
    evidence: String(b.evidence).slice(0, 1000),
  });

  return NextResponse.json({ ok: true });
}
