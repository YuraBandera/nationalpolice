import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { readDb, mutate } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import type { Contacts } from "@/lib/types";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.contacts);
}

export async function PUT(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const c = (await request.json().catch(() => ({}))) as Contacts;
  await mutate((db) => {
    db.contacts = {
      discord: String(c.discord || db.contacts.discord),
      robloxUrl: String(c.robloxUrl || db.contacts.robloxUrl),
      email: String(c.email || db.contacts.email),
      hours: String(c.hours || db.contacts.hours),
      socials: Array.isArray(c.socials)
        ? c.socials.map((s) => ({ label: String(s.label || ""), url: String(s.url || "") }))
        : db.contacts.socials,
    };
  });
  return NextResponse.json({ ok: true });
}
