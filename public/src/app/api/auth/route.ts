import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkPassword, makeSessionCookie, clearSessionCookie, isAuthed } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ authed: isAuthed() });
}

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({}));
  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Невірний пароль" }, { status: 401 });
  }
  cookies().set(makeSessionCookie());
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  cookies().set(clearSessionCookie());
  return NextResponse.json({ ok: true });
}
