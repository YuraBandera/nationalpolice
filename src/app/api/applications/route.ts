import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { readDb, mutate, uid } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import { notifyApplication } from "@/lib/discord";
import type { Application, ApplicationAnswer } from "@/lib/types";

const req = (v: unknown) => typeof v === "string" && v.trim().length > 0;

export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}));
  if (!req(b.firstName) || !req(b.lastName) || !req(b.discord) || !req(b.age)) {
    return NextResponse.json({ error: "Заповніть обов'язкові поля" }, { status: 400 });
  }

  const answers: ApplicationAnswer[] = Array.isArray(b.answers)
    ? b.answers
        .map((a: ApplicationAnswer) => ({
          questionId: String(a.questionId || ""),
          label: String(a.label || "").slice(0, 200),
          value: String(a.value || "").slice(0, 4000),
        }))
        .filter((a: ApplicationAnswer) => a.label)
    : [];

  const app: Application = {
    id: uid(),
    firstName: String(b.firstName).slice(0, 80),
    lastName: String(b.lastName).slice(0, 80),
    discord: String(b.discord).slice(0, 80),
    age: String(b.age).slice(0, 20),
    answers,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  await mutate((db) => db.applications.unshift(app));
  await notifyApplication(app);
  return NextResponse.json({ ok: true, id: app.id });
}

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const db = await readDb();
  return NextResponse.json(db.applications);
}

export async function PATCH(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const { id, status } = await request.json().catch(() => ({}));
  await mutate((db) => {
    const a = db.applications.find((x) => x.id === id);
    if (a) a.status = status;
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const { id } = await request.json().catch(() => ({}));
  await mutate((db) => {
    db.applications = db.applications.filter((x) => x.id !== id);
  });
  return NextResponse.json({ ok: true });
}
