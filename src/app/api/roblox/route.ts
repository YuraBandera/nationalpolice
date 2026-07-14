import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { isAuthed } from "@/lib/auth";
import { resolveRoblox } from "@/lib/roblox";

export async function GET(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "";
  const user = await resolveRoblox(username);
  if (!user) return NextResponse.json({ found: false });
  return NextResponse.json({ found: true, ...user });
}
