import { cookies } from "next/headers";
import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "crypto";
import { readDb } from "./db";
import type { Investigator } from "./types";

const COOKIE = "erdr_session";

function secret(): string {
  return process.env.ADMIN_PASSWORD || "changeme-2026";
}

/** Хешування пароля слідчого: "salt:hash". */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const test = scryptSync(password, salt, 64);
    const orig = Buffer.from(hash, "hex");
    return orig.length === test.length && timingSafeEqual(orig, test);
  } catch {
    return false;
  }
}

/** Підписаний токен сесії слідчого: "<id>.<hmac>". */
function sign(id: string): string {
  const mac = createHmac("sha256", secret()).update("erdr::" + id).digest("hex");
  return `${id}.${mac}`;
}

function verifyToken(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const id = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expect = createHmac("sha256", secret()).update("erdr::" + id).digest("hex");
  if (mac.length !== expect.length) return null;
  return timingSafeEqual(Buffer.from(mac), Buffer.from(expect)) ? id : null;
}

export function makeErdrCookie(id: string) {
  return {
    name: COOKIE,
    value: sign(id),
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function clearErdrCookie() {
  return { name: COOKIE, value: "", httpOnly: true, path: "/", maxAge: 0 };
}

/** Поточний слідчий за сесією (перевіряє існування й активність акаунта). */
export async function currentInvestigator(): Promise<Investigator | null> {
  const c = cookies().get(COOKIE);
  if (!c) return null;
  const id = verifyToken(c.value);
  if (!id) return null;
  const db = await readDb();
  const inv = db.investigators.find((x) => x.id === id);
  if (!inv || !inv.active) return null;
  return inv;
}
