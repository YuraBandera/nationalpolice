// Резолвить Roblox-нік у профіль через публічний Roblox API (серверно).

export interface RobloxUser {
  id: number;
  name: string;
  displayName: string;
  profileUrl: string;
  avatar?: string;
}

export type RobloxCheck = "found" | "not_found" | "error";

/**
 * Перевіряє існування Roblox-ніка.
 * "found" — існує; "not_found" — точно немає; "error" — API недоступний (не блокуємо).
 */
export async function checkRobloxExists(username: string): Promise<RobloxCheck> {
  const uname = String(username || "").trim();
  if (!uname) return "not_found";
  try {
    const res = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [uname], excludeBannedUsers: false }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return "error";
    const data = await res.json();
    return data?.data?.[0]?.id ? "found" : "not_found";
  } catch {
    return "error";
  }
}

export async function resolveRoblox(username: string): Promise<RobloxUser | null> {
  const uname = String(username || "").trim();
  if (!uname) return null;

  try {
    // 1) нік → userId
    const res = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [uname], excludeBannedUsers: false }),
      // не блокуємо надовго
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const u = data?.data?.[0];
    if (!u?.id) return null;

    const user: RobloxUser = {
      id: u.id,
      name: u.name,
      displayName: u.displayName || u.name,
      profileUrl: `https://www.roblox.com/users/${u.id}/profile`,
    };

    // 2) аватар (best-effort)
    try {
      const av = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${u.id}&size=150x150&format=Png&isCircular=false`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (av.ok) {
        const avData = await av.json();
        const url = avData?.data?.[0]?.imageUrl;
        if (url) user.avatar = url;
      }
    } catch {
      /* аватар не критичний */
    }

    return user;
  } catch {
    return null;
  }
}
