import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { readDb } from "@/lib/db";
import { verifyPassword, makeErdrCookie, clearErdrCookie } from "@/lib/erdrAuth";

export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}));
  const login = String(b.login || "").trim().toLowerCase();
  const password = String(b.password || "");
  const db = await readDb();
  const inv = db.investigators.find((x) => x.login === login);
  if (!inv || !inv.active || !verifyPassword(password, inv.passHash)) {
    return NextResponse.json({ error: "Невірний логін або пароль." }, { status: 401 });
  }
  cookies().set(makeErdrCookie(inv.id));
  return NextResponse.json({ ok: true, name: inv.name, rank: inv.rank });
}

export async function DELETE() {
  cookies().set(clearErdrCookie());
  return NextResponse.json({ ok: true });
}
