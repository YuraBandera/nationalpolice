"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Emblem } from "@/components/Emblem";
import { useToast } from "@/components/Toast";
import { ErdrLookup } from "./ErdrLookup";
import { StatementForm } from "./StatementForm";
import { AdminOffenseForm } from "./AdminOffenseForm";
import { IconFile, IconAlert, IconLock, IconArrowRight, IconExternal } from "@/components/icons";

interface Access {
  nick: string;
  name: string;
  avatar?: string;
  profileUrl?: string;
}

const KEY = "erdr_access_v1";

export function ErdrGate() {
  const toast = useToast();
  const [access, setAccess] = useState<Access | null>(null);
  const [ready, setReady] = useState(false);
  const [nick, setNick] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"lookup" | "statement" | "offense">("lookup");

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

  if (!ready) {
    return <div className="py-24 text-center text-navy-800/40">Завантаження реєстру…</div>;
  }

  /* ---------- ЕКРАН ВХОДУ ---------- */
  if (!access) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-navy-900/12 bg-white shadow-card">
          {/* офіційна шапка */}
          <div className="flex items-center gap-4 border-b-2 border-navy-900/10 bg-navy-950 px-6 py-5 text-white sm:px-8">
            <Emblem className="h-14 w-14 shrink-0" alt="Емблема" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-signal">
                Головне слідче управління · ГУНП у м. Києві
              </p>
              <h2 className="font-display text-lg font-semibold leading-tight sm:text-xl">
                Єдиний реєстр досудових розслідувань
              </h2>
            </div>
          </div>

          <div className="px-6 py-7 sm:px-8">
            {/* попередження про відповідальність */}
            <div className="mb-6 rounded-xl border border-bad/25 bg-bad/[0.04] p-5">
              <div className="mb-2 flex items-center gap-2 font-semibold text-bad">
                <IconAlert width={18} height={18} />
                Попередження про кримінальну відповідальність
              </div>
              <p className="text-[13.5px] leading-relaxed text-navy-800/75">
                Доступ до ЄРДР надається виключно для перевірки та подання відомостей у межах правил
                проєкту. <span className="font-semibold text-navy-900">Несанкціоноване втручання</span> в
                роботу реєстру, внесення завідомо неправдивих відомостей або використання чужих даних
                тягне за собою відповідальність згідно зі{" "}
                <span className="font-mono font-semibold">ст. 5.6</span> (підроблення документів) та{" "}
                <span className="font-mono font-semibold">ст. 5.4</span> ККУ. Усі дії в реєстрі
                журналюються із зазначенням особи та часу.
              </p>
            </div>

            <label className="field-label flex items-center gap-2">
              <IconLock width={13} height={13} /> Ідентифікація — ваш нік Roblox
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
                {loading ? "Перевірка…" : "Увійти до реєстру"}
                {!loading && <IconArrowRight width={17} height={17} />}
              </button>
            </div>
            <p className="mt-3 text-[12.5px] text-navy-800/50">
              Вхід дозволено лише за наявним ніком Roblox. Нік перевіряється в системі Roblox.
            </p>

            <div className="mt-7 border-t border-navy-900/8 pt-5">
              <Link
                href="/erdr/panel"
                className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 transition hover:text-navy-900"
              >
                <IconFile width={15} height={15} /> Вхід для слідчих (службовий доступ)
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- РЕЄСТР (після входу) ---------- */
  return (
    <div className="mx-auto max-w-3xl">
      {/* смуга авторизації */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-navy-900/10 bg-white px-4 py-3 shadow-sm">
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
        <button onClick={exit} className="btn-ghost h-9 px-3 text-[13px]">
          Вийти
        </button>
      </div>

      {/* перемикач */}
      <div className="mb-5 flex flex-wrap gap-1 rounded-xl border border-navy-900/10 bg-white p-1">
        <button
          onClick={() => setTab("lookup")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            tab === "lookup" ? "bg-navy-900 text-white" : "text-navy-800/60 hover:text-navy-900"
          }`}
        >
          Перевірити провадження
        </button>
        <button
          onClick={() => setTab("statement")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            tab === "statement" ? "bg-navy-900 text-white" : "text-navy-800/60 hover:text-navy-900"
          }`}
        >
          Заява про злочин
        </button>
        <button
          onClick={() => setTab("offense")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            tab === "offense" ? "bg-navy-900 text-white" : "text-navy-800/60 hover:text-navy-900"
          }`}
        >
          Адмінправопорушення
        </button>
      </div>

      {tab === "lookup" && <ErdrLookup />}
      {tab === "statement" && <StatementForm lockedApplicant={access.nick} />}
      {tab === "offense" && <AdminOffenseForm lockedApplicant={access.nick} />}
    </div>
  );
}
