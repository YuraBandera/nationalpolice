import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { resolveRoblox } from "@/lib/roblox";
import { clientIp, checkSpam } from "@/lib/antispam";

export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}));
  const nick = String(b.nick || "").trim();
  if (nick.length < 2) {
    return NextResponse.json({ error: "Введіть ваш нік Roblox." }, { status: 400 });
  }

  // легкий ліміт, щоб реєстр не використовували як проксі до Roblox
  const ip = clientIp(request);
  const spam = checkSpam(ip, { scope: "access", minGapMs: 1500, max: 40, windowMs: 60 * 60_000 });
  if (!spam.ok) return NextResponse.json({ error: spam.reason }, { status: 429 });

  const user = await resolveRoblox(nick);
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Гравця Roblox з таким ніком не знайдено. Доступ відхилено." },
      { status: 404 }
    );
  }
  return NextResponse.json({
    ok: true,
    id: user.id,
    name: user.name,
    displayName: user.displayName,
    avatar: user.avatar,
    profileUrl: user.profileUrl,
  });
}
