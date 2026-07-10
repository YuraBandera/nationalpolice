import { cookies } from "next/headers";
import { createHash } from "crypto";

const COOKIE = "gunp_admin";

function token(): string {
  const pass = process.env.ADMIN_PASSWORD || "changeme-2026";
  return createHash("sha256").update("gunp::" + pass).digest("hex");
}

export function checkPassword(input: string): boolean {
  return (input || "") === (process.env.ADMIN_PASSWORD || "changeme-2026");
}

export function makeSessionCookie() {
  return {
    name: COOKIE,
    value: token(),
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function clearSessionCookie() {
  return { name: COOKIE, value: "", httpOnly: true, path: "/", maxAge: 0 };
}

export function isAuthed(): boolean {
  const c = cookies().get(COOKIE);
  return !!c && c.value === token();
}
