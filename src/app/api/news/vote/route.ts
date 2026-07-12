import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { mutate } from "@/lib/db";

const clampDelta = (v: unknown): number => {
  const n = Number(v);
  if (n > 0) return 1;
  if (n < 0) return -1;
  return 0;
};

export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}));
  const id = String(b.id || "");
  const likeD = clampDelta(b.likes);
  const dislikeD = clampDelta(b.dislikes);
  if (!id || (likeD === 0 && dislikeD === 0)) {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  const result = await mutate((db) => {
    const n = db.news.find((x) => x.id === id);
    if (!n) return null;
    n.likes = Math.max(0, (n.likes || 0) + likeD);
    n.dislikes = Math.max(0, (n.dislikes || 0) + dislikeD);
    return { likes: n.likes, dislikes: n.dislikes };
  });

  if (!result) return NextResponse.json({ error: "Новину не знайдено" }, { status: 404 });
  return NextResponse.json(result);
}
