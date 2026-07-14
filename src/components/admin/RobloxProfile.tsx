"use client";

import { useEffect, useState } from "react";
import { IconExternal, IconUsers } from "@/components/icons";

interface RUser {
  found: boolean;
  id?: number;
  name?: string;
  displayName?: string;
  profileUrl?: string;
  avatar?: string;
}

export function RobloxProfile({ label, username }: { label: string; username?: string }) {
  const [state, setState] = useState<"loading" | "done">("loading");
  const [user, setUser] = useState<RUser | null>(null);

  useEffect(() => {
    if (!username || !username.trim()) {
      setState("done");
      return;
    }
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/roblox?username=${encodeURIComponent(username.trim())}`, {
          cache: "no-store",
        });
        const d = await r.json();
        if (alive) setUser(d);
      } catch {
        if (alive) setUser({ found: false });
      } finally {
        if (alive) setState("done");
      }
    })();
    return () => {
      alive = false;
    };
  }, [username]);

  if (!username || !username.trim()) return null;

  return (
    <div className="rounded-xl border border-white/8 bg-navy-950/50 p-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ice/45">{label}</p>

      {state === "loading" ? (
        <div className="flex items-center gap-2 text-sm text-ice/50">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-signal" />
          Пошук профілю…
        </div>
      ) : user?.found ? (
        <a
          href={user.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 rounded-lg p-1 transition hover:bg-white/5"
        >
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt="" className="h-12 w-12 rounded-lg bg-navy-800 object-cover" />
          ) : (
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-navy-600/30 text-navy-300">
              <IconUsers width={20} height={20} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-head font-semibold text-white">{user.displayName}</p>
            <p className="truncate text-xs text-ice/50">@{user.name}</p>
          </div>
          <span className="flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-signal opacity-70 transition group-hover:opacity-100">
            Профіль <IconExternal width={13} height={13} />
          </span>
        </a>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <span className="text-[15px] text-ice/85">{username}</span>
          <span className="text-xs text-bad/70">профіль не знайдено</span>
        </div>
      )}
    </div>
  );
}
