import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { readDb, mutate } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import type { SiteSettings } from "@/lib/types";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.settings);
}

export async function PUT(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const s = (await request.json().catch(() => ({}))) as Partial<SiteSettings>;
  await mutate((db) => {
    db.settings = {
      recruitmentOpen:
        typeof s.recruitmentOpen === "boolean" ? s.recruitmentOpen : db.settings.recruitmentOpen,
      recruitmentClosedTitle:
        s.recruitmentClosedTitle !== undefined
          ? String(s.recruitmentClosedTitle).slice(0, 160)
          : db.settings.recruitmentClosedTitle,
      recruitmentClosedMessage:
        s.recruitmentClosedMessage !== undefined
          ? String(s.recruitmentClosedMessage).slice(0, 1000)
          : db.settings.recruitmentClosedMessage,
    };
  });
  return NextResponse.json({ ok: true });
}
