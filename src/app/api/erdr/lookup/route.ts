import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { readDb } from "@/lib/db";
import { articleTitle, articlePunishment } from "@/lib/kkArticles";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const number = (searchParams.get("number") || "").replace(/\s+/g, "");
  if (!number) return NextResponse.json({ found: false });

  const db = await readDb();
  const c = db.erdr.find((x) => x.number === number);
  if (!c) return NextResponse.json({ found: false });

  // Публічна картка: без внутрішнього журналу дій
  return NextResponse.json({
    found: true,
    number: c.number,
    articles: c.articles.map((a) => ({ code: a, title: articleTitle(a), punishment: articlePunishment(a) })),
    status: c.status,
    fabula: c.fabula,
    applicant: c.applicant,
    suspect: c.suspect,
    signature: c.signature || "",
    applicantSignature: c.applicantSignature || "",
    source: c.source,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  });
}
