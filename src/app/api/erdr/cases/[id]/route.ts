import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { mutate, uid } from "@/lib/db";
import { currentInvestigator } from "@/lib/erdrAuth";
import type { ErdrStatus } from "@/lib/types";

const STATUSES: ErdrStatus[] = ["registered", "investigating", "suspended", "court", "closed"];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const inv = await currentInvestigator();
  if (!inv) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  const now = new Date().toISOString();

  let found = false;
  await mutate((d) => {
    const c = d.erdr.find((x) => x.id === params.id);
    if (!c) return;
    found = true;

    if (typeof b.status === "string" && STATUSES.includes(b.status as ErdrStatus)) {
      if (c.status !== b.status) {
        c.entries.push({
          id: uid(),
          text: `Статус змінено: ${b.status}`,
          author: inv.name || inv.login,
          at: now,
        });
      }
      c.status = b.status as ErdrStatus;
    }
    if (typeof b.fabula === "string") c.fabula = b.fabula.slice(0, 5000);
    if (Array.isArray(b.articles)) {
      c.articles = b.articles.map((a: unknown) => String(a)).filter(Boolean).slice(0, 20);
    }
    if (typeof b.suspect === "string") c.suspect = b.suspect.slice(0, 60);
    if (typeof b.signature === "string") c.signature = b.signature.slice(0, 400);
    if (b.assignSelf === true) c.investigatorId = inv.id;
    if (typeof b.entry === "string" && b.entry.trim()) {
      c.entries.push({
        id: uid(),
        text: b.entry.slice(0, 2000),
        author: inv.name || inv.login,
        at: now,
      });
    }
    c.updatedAt = now;
  });

  if (!found) return NextResponse.json({ error: "Провадження не знайдено" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
