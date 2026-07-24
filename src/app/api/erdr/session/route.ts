import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { currentInvestigator } from "@/lib/erdrAuth";

export async function GET() {
  const inv = await currentInvestigator();
  if (!inv) return NextResponse.json({ auth: false });
  return NextResponse.json({ auth: true, id: inv.id, name: inv.name, rank: inv.rank, login: inv.login });
}
