import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { readDb, mutate, uid } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import type { NewsItem } from "@/lib/types";

export async function GET() {
  const db = await readDb();
  const news = [...db.news].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return NextResponse.json(news);
}

export async function POST(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  if (!b.title) return NextResponse.json({ error: "Потрібен заголовок" }, { status: 400 });
  const item: NewsItem = {
    id: uid(),
    title: String(b.title).slice(0, 200),
    date: b.date || new Date().toISOString(),
    author: String(b.author || "Пресслужба ГУНП").slice(0, 120),
    image: String(b.image || ""),
    excerpt: String(b.excerpt || "").slice(0, 400),
    body: String(b.body || "").slice(0, 20000),
    createdAt: new Date().toISOString(),
  };
  await mutate((db) => db.news.unshift(item));
  return NextResponse.json({ ok: true, item });
}

export async function PATCH(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  await mutate((db) => {
    const n = db.news.find((x) => x.id === b.id);
    if (n) Object.assign(n, {
      title: b.title ?? n.title,
      date: b.date ?? n.date,
      author: b.author ?? n.author,
      image: b.image ?? n.image,
      excerpt: b.excerpt ?? n.excerpt,
      body: b.body ?? n.body,
    });
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const { id } = await request.json().catch(() => ({}));
  await mutate((db) => {
    db.news = db.news.filter((x) => x.id !== id);
  });
  return NextResponse.json({ ok: true });
}
