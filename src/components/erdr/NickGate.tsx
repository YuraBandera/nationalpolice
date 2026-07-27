"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Emblem } from "@/components/Emblem";
import { useToast } from "@/components/Toast";
import { IconLock, IconArrowRight, IconExternal } from "@/components/icons";

interface Access {
  nick: string;
  name: string;
  avatar?: string;
  profileUrl?: string;
}

const KEY = "erdr_access_v1"; // спільний ключ — один вхід працює на всіх формах

export function NickGate({
  title = "Ідентифікація",
  subtitle,
  warning,
  footer,
  children,
}: {
  title?: string;
  subtitle?: string;
  warning?: ReactNode;
  footer?: ReactNode;
  children: (nick: string, exit: () => void) => ReactNode;
}) {
  const toast = useToast();
  const [access, setAccess] = useState<Access | null>(null);
  const [ready, setReady] = useState(false);
  const [nick, setNick] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setAccess(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  async function enter() {
    if (nick.trim().length < 2) {
      toast("Введіть ваш нік Roblox", "error");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/erdr/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nick: nick.trim() }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) {
        toast(d.error || "Доступ відхилено", "error");
        return;
      }
      const a: Access = { nick: d.name, name: d.displayName, avatar: d.avatar, profileUrl: d.profileUrl };
      setAccess(a);
      try {
        localStorage.setItem(KEY, JSON.stringify(a));
      } catch {
        /* ignore */
      }
    } finally {
      setLoading(false);
    }
  }

  function exit() {
    setAccess(null);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }

  if (!ready) return <div className="py-24 text-center text-navy-800/40">Завантаження…</div>;

  if (!access) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-navy-900/12 bg-white shadow-card">
          <div className="flex items-center gap-4 border-b-2 border-navy-900/10 bg-navy-950 px-6 py-5 text-white sm:px-8">
            <Emblem className="h-14 w-14 shrink-0" alt="Емблема" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-signal">
                ГУНП у м. Києві
              </p>
              <h2 className="font-display text-lg font-semibold leading-tight sm:text-xl">{title}</h2>
            </div>
          </div>
          <div className="px-6 py-7 sm:px-8">
            {warning}
            <label className="field-label flex items-center gap-2">
              <IconLock width={13} height={13} /> Ваш нік Roblox
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                className="field flex-1"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enter()}
                placeholder="Введіть ваш нікнейм Roblox"
                autoComplete="off"
              />
              <button onClick={enter} disabled={loading} className="btn-signal px-6 py-3.5 disabled:opacity-60">
                {loading ? "Перевірка…" : "Увійти"}
                {!loading && <IconArrowRight width={17} height={17} />}
              </button>
            </div>
            <p className="mt-3 text-[12.5px] text-navy-800/50">
              {subtitle || "Нік перевіряється в системі Roblox. Усі дії журналюються."}
            </p>
            {footer && <div className="mt-7 border-t border-navy-900/8 pt-5">{footer}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto mb-5 flex max-w-3xl flex-wrap items-center gap-3 rounded-xl border border-navy-900/10 bg-white px-4 py-3 shadow-sm">
        {access.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={access.avatar} alt="" className="h-9 w-9 rounded-lg bg-navy-900/5 object-cover" />
        ) : (
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-900/8 text-navy-700">
            <IconLock width={16} height={16} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-800/45">Ви увійшли як</p>
          <p className="truncate font-semibold text-navy-900">
            {access.name} <span className="font-mono text-xs font-normal text-navy-800/50">@{access.nick}</span>
          </p>
        </div>
        {access.profileUrl && (
          <a
            href={access.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 text-xs font-semibold text-navy-600 hover:text-navy-900 sm:inline-flex"
          >
            Профіль <IconExternal width={12} height={12} />
          </a>
        )}
        <button onClick={exit} className="btn-ghost h-9 px-3 text-[13px]">Вийти</button>
      </div>
      {children(access.nick, exit)}
    </div>
  );
}
