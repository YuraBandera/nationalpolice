import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { readDb, mutate, uid } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import { hashPassword } from "@/lib/erdrAuth";
import type { Investigator } from "@/lib/types";

// без passHash назовні
function sanitize(i: Investigator) {
  const { passHash, ...rest } = i;
  void passHash;
  return rest;
}

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const db = await readDb();
  return NextResponse.json(db.investigators.map(sanitize));
}

export async function POST(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  const login = String(b.login || "").trim().toLowerCase();
  const password = String(b.password || "");
  if (login.length < 3 || password.length < 4) {
    return NextResponse.json(
      { error: "Логін від 3 символів, пароль від 4 символів." },
      { status: 400 }
    );
  }
  const db = await readDb();
  if (db.investigators.some((x) => x.login === login)) {
    return NextResponse.json({ error: "Такий логін вже існує." }, { status: 409 });
  }
  const inv: Investigator = {
    id: uid(),
    login,
    passHash: hashPassword(password),
    name: String(b.name || "").slice(0, 120),
    rank: String(b.rank || "Слідчий").slice(0, 120),
    active: true,
    createdAt: new Date().toISOString(),
  };
  await mutate((d) => d.investigators.push(inv));
  return NextResponse.json({ ok: true, investigator: sanitize(inv) });
}

export async function PATCH(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  const id = String(b.id || "");
  await mutate((d) => {
    const inv = d.investigators.find((x) => x.id === id);
    if (!inv) return;
    if (typeof b.name === "string") inv.name = b.name.slice(0, 120);
    if (typeof b.rank === "string") inv.rank = b.rank.slice(0, 120);
    if (typeof b.active === "boolean") inv.active = b.active;
    if (typeof b.password === "string" && b.password.length >= 4) {
      inv.passHash = hashPassword(b.password);
    }
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const { id } = await request.json().catch(() => ({}));
  await mutate((d) => {
    d.investigators = d.investigators.filter((x) => x.id !== id);
  });
  return NextResponse.json({ ok: true });
}
