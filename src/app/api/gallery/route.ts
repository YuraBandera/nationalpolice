import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { readDb, mutate, uid } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import type { GalleryItem } from "@/lib/types";

export async function GET() {
  const db = await readDb();
  const items = [...db.gallery].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  const item: GalleryItem = {
    id: uid(),
    type: b.type === "video" ? "video" : "image",
    src: String(b.src || ""),
    poster: b.poster ? String(b.poster) : undefined,
    caption: String(b.caption || "").slice(0, 200),
    createdAt: new Date().toISOString(),
  };
  await mutate((db) => db.gallery.unshift(item));
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const { id } = await request.json().catch(() => ({}));
  await mutate((db) => {
    db.gallery = db.gallery.filter((x) => x.id !== id);
  });
  return NextResponse.json({ ok: true });
}
