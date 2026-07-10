"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { Emblem } from "@/components/Emblem";
import {
  IconLock,
  IconLogout,
  IconNews,
  IconImage,
  IconFile,
  IconAlert,
  IconUsers,
  IconTarget,
  IconPhone,
  IconArrowRight,
} from "@/components/icons";
import { NewsAdmin } from "./NewsAdmin";
import { GalleryAdmin } from "./GalleryAdmin";
import { SubmissionsAdmin } from "./SubmissionsAdmin";
import { LeadershipAdmin } from "./LeadershipAdmin";
import { StatsAdmin } from "./StatsAdmin";
import { ContactsAdmin } from "./ContactsAdmin";
import { ABtn, AInput } from "./ui";

type Tab =
  | "news"
  | "gallery"
  | "applications"
  | "complaints"
  | "leadership"
  | "stats"
  | "contacts";

const TABS: { id: Tab; label: string; Icon: (p: { width?: number; height?: number }) => JSX.Element }[] = [
  { id: "news", label: "Новини", Icon: IconNews },
  { id: "gallery", label: "Галерея", Icon: IconImage },
  { id: "applications", label: "Заявки", Icon: IconFile },
  { id: "complaints", label: "Скарги", Icon: IconAlert },
  { id: "leadership", label: "Керівництво", Icon: IconUsers },
  { id: "stats", label: "Статистика", Icon: IconTarget },
  { id: "contacts", label: "Контакти", Icon: IconPhone },
];

export function AdminApp() {
  const toast = useToast();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("news");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/auth", { cache: "no-store" });
        const d = await r.json();
        setAuthed(!!d.authed);
      } catch {
        setAuthed(false);
      }
    })();
  }, []);

  const login = async () => {
    setBusy(true);
    try {
      const r = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!r.ok) {
        toast("Невірний пароль", "error");
        return;
      }
      setAuthed(true);
      setPassword("");
      toast("Вітаємо в панелі керування", "success");
    } catch {
      toast("Помилка входу", "error");
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthed(false);
    toast("Ви вийшли з панелі", "info");
  };

  if (authed === null) {
    return (
      <div className="grid min-h-screen place-items-center bg-navy-950 text-ice/50">
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-signal" />
          Завантаження…
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="relative grid min-h-screen place-items-center overflow-hidden bg-navy-950 px-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(74,124,214,0.5), transparent 45%), radial-gradient(circle at 75% 80%, rgba(255,212,0,0.3), transparent 45%)",
          }}
        />
        <div className="relative w-full max-w-sm rounded-2xl border border-white/12 bg-navy-900/70 p-8 backdrop-blur-xl shadow-glow">
          <div className="flex flex-col items-center text-center">
            <Emblem className="h-16 w-16" />
            <h1 className="mt-4 font-display text-xl font-semibold text-white">Панель керування</h1>
            <p className="mt-1 text-sm text-ice/50">ГУНП м. Київ · доступ адміністратора</p>
          </div>
          <div className="mt-7 space-y-4">
            <div>
              <span className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ice/55">
                <IconLock width={13} height={13} /> Пароль
              </span>
              <AInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
                placeholder="••••••••"
                autoFocus
              />
            </div>
            <ABtn variant="signal" className="w-full" onClick={login} disabled={busy}>
              {busy ? "Перевірка…" : "Увійти"}
              {!busy && <IconArrowRight width={16} height={16} />}
            </ABtn>
          </div>
          <p className="mt-6 text-center text-xs text-ice/35">
            Пароль задається змінною ADMIN_PASSWORD
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-ice/80">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-3">
            <Emblem className="h-9 w-9" />
            <div className="leading-tight">
              <p className="font-head text-sm font-semibold text-white">Панель керування</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ice/40">
                ГУНП м. Київ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="hidden rounded-lg border border-white/12 px-3 py-2 text-sm text-ice/70 transition hover:text-white sm:inline-flex"
            >
              На сайт
            </a>
            <ABtn variant="ghost" onClick={logout}>
              <IconLogout width={15} height={15} /> Вихід
            </ABtn>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] gap-6 px-5 py-6 lg:grid lg:grid-cols-[220px_1fr]">
        <aside className="mb-4 lg:mb-0">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {TABS.map((t) => {
              const on = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    on
                      ? "bg-navy-500/20 text-white ring-1 ring-navy-400/30"
                      : "text-ice/55 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <t.Icon width={17} height={17} />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">
          {tab === "news" && <NewsAdmin />}
          {tab === "gallery" && <GalleryAdmin />}
          {tab === "applications" && <SubmissionsAdmin kind="applications" />}
          {tab === "complaints" && <SubmissionsAdmin kind="complaints" />}
          {tab === "leadership" && <LeadershipAdmin />}
          {tab === "stats" && <StatsAdmin />}
          {tab === "contacts" && <ContactsAdmin />}
        </main>
      </div>
    </div>
  );
}
