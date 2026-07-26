"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/Toast";
import { KK_ARTICLES, statusLabel, statusColor, ERDR_STATUSES, articleTitle } from "@/lib/kkArticles";
import { SignatureUpload } from "./SignatureUpload";
import type { ErdrCase } from "@/lib/types";

interface Session {
  auth: boolean;
  id?: string;
  name?: string;
  rank?: string;
  login?: string;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function InvestigatorPanel() {
  const toast = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [cases, setCases] = useState<ErdrCase[]>([]);
  const [open, setOpen] = useState<ErdrCase | null>(null);
  const [creating, setCreating] = useState(false);

  const loadSession = useCallback(async () => {
    const r = await fetch("/api/erdr/session", { cache: "no-store" });
    setSession(await r.json());
  }, []);

  const loadCases = useCallback(async () => {
    const r = await fetch("/api/erdr/cases", { cache: "no-store" });
    if (r.ok) setCases(await r.json());
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (session?.auth) loadCases();
  }, [session?.auth, loadCases]);

  if (session === null) {
    return <div className="py-20 text-center text-ice/50">Завантаження…</div>;
  }

  if (!session.auth) {
    return <LoginForm onDone={loadSession} />;
  }

  async function logout() {
    await fetch("/api/erdr/login", { method: "DELETE" });
    setSession({ auth: false });
    setCases([]);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-head text-lg font-bold text-white">{session.name || session.login}</p>
          <p className="text-sm text-ice/50">{session.rank}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCreating(true)} className="btn-signal px-4 py-2.5">
            + Нове провадження
          </button>
          <button onClick={logout} className="btn-ghost">
            Вийти
          </button>
        </div>
      </div>

      {cases.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] py-16 text-center text-ice/45">
          Проваджень ще немає. Створіть перше.
        </div>
      ) : (
        <div className="grid gap-3">
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => setOpen(c)}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-white/8 bg-white/[0.04] p-4 text-left transition hover:border-navy-400/40 hover:bg-white/[0.07]"
            >
              <span className="font-mono text-sm font-semibold text-white">{c.number}</span>
              <span className="flex flex-wrap gap-1">
                {c.articles.map((a) => (
                  <span key={a} className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-[11px] text-ice/70">
                    {a}
                  </span>
                ))}
              </span>
              <span className="ml-auto flex items-center gap-2">
                {c.source === "citizen" && (
                  <span className="rounded bg-signal/15 px-2 py-0.5 text-[11px] font-semibold text-signal">
                    заява
                  </span>
                )}
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                  style={{ background: statusColor(c.status) }}
                >
                  {statusLabel(c.status)}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {creating && (
        <CreateCase
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            loadCases();
            toast("Провадження зареєстровано", "success");
          }}
        />
      )}

      {open && (
        <CaseDetail
          item={open}
          onClose={() => setOpen(null)}
          onChanged={async () => {
            await loadCases();
          }}
        />
      )}
    </div>
  );
}

/* ---------- Вхід ---------- */
function LoginForm({ onDone }: { onDone: () => void }) {
  const toast = useToast();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!login || !password) return;
    setLoading(true);
    try {
      const r = await fetch("/api/erdr/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        toast(d.error || "Помилка входу", "error");
        return;
      }
      onDone();
    } catch {
      toast("Помилка входу", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8">
      <h2 className="mb-1 font-head text-xl font-bold text-white">Вхід для слідчих</h2>
      <p className="mb-6 text-sm text-ice/50">Доступ надає адміністрація ГСУ.</p>
      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ice/45">Логін</label>
      <input
        className="mb-4 w-full rounded-xl border border-white/12 bg-navy-950/60 px-4 py-2.5 text-white focus:border-navy-400 focus:outline-none"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        autoComplete="username"
      />
      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ice/45">Пароль</label>
      <input
        type="password"
        className="mb-6 w-full rounded-xl border border-white/12 bg-navy-950/60 px-4 py-2.5 text-white focus:border-navy-400 focus:outline-none"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        autoComplete="current-password"
      />
      <button onClick={submit} disabled={loading} className="btn-signal w-full py-3 disabled:opacity-60">
        {loading ? "Вхід…" : "Увійти"}
      </button>
    </div>
  );
}

/* ---------- Вибір статей ---------- */
function ArticlePicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [q, setQ] = useState("");
  const toggle = (code: string) =>
    onChange(value.includes(code) ? value.filter((c) => c !== code) : [...value, code]);
  const filtered = KK_ARTICLES.filter(
    (a) => a.code.includes(q) || a.title.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div>
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((c) => (
            <button
              key={c}
              onClick={() => toggle(c)}
              className="rounded-lg bg-signal/15 px-2 py-1 text-xs font-semibold text-signal"
            >
              ст. {c} ✕
            </button>
          ))}
        </div>
      )}
      <input
        className="mb-2 w-full rounded-lg border border-white/12 bg-navy-950/60 px-3 py-2 text-sm text-white focus:border-navy-400 focus:outline-none"
        placeholder="Пошук статті…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="max-h-44 space-y-1 overflow-y-auto rounded-lg border border-white/8 p-1">
        {filtered.map((a) => (
          <button
            key={a.code}
            onClick={() => toggle(a.code)}
            className={`block w-full rounded px-2 py-1.5 text-left text-[13px] transition ${
              value.includes(a.code) ? "bg-signal/15 text-signal" : "text-ice/70 hover:bg-white/5"
            }`}
          >
            <span className="font-mono font-semibold">ст. {a.code}</span> — {a.title}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Створення ---------- */
function CreateCase({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const toast = useToast();
  const [articles, setArticles] = useState<string[]>([]);
  const [fabula, setFabula] = useState("");
  const [applicant, setApplicant] = useState("");
  const [suspect, setSuspect] = useState("");
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    try {
      const r = await fetch("/api/erdr/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles, fabula, applicant, suspect, signature }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        toast(d.error || "Не вдалося створити", "error");
        return;
      }
      onCreated();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal onClose={onClose} title="Нове провадження">
      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ice/45">Статті ККУ *</p>
          <ArticlePicker value={articles} onChange={setArticles} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Fld label="Заявник (Roblox)"><Inp value={applicant} onChange={setApplicant} /></Fld>
          <Fld label="Підозрюваний (Roblox)"><Inp value={suspect} onChange={setSuspect} /></Fld>
        </div>
        <Fld label="Фабула *">
          <textarea
            className="min-h-[100px] w-full resize-y rounded-xl border border-white/12 bg-navy-950/60 px-4 py-2.5 text-white focus:border-navy-400 focus:outline-none"
            value={fabula}
            onChange={(e) => setFabula(e.target.value)}
          />
        </Fld>
        <Fld label="Ваш підпис (PNG)">
          <SignatureUpload value={signature} onChange={setSignature} dark />
        </Fld>
        <button onClick={save} disabled={loading} className="btn-signal w-full py-3 disabled:opacity-60">
          {loading ? "Реєстрація…" : "Зареєструвати провадження"}
        </button>
      </div>
    </Modal>
  );
}

/* ---------- Деталі / ведення ---------- */
function CaseDetail({
  item,
  onClose,
  onChanged,
}: {
  item: ErdrCase;
  onClose: () => void;
  onChanged: () => void;
}) {
  const toast = useToast();
  const [c, setC] = useState<ErdrCase>(item);
  const [entry, setEntry] = useState("");
  const [busy, setBusy] = useState(false);

  async function patch(body: Record<string, unknown>, okMsg?: string) {
    setBusy(true);
    try {
      const r = await fetch(`/api/erdr/cases/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        toast("Не вдалося зберегти", "error");
        return;
      }
      // локально оновлюємо
      const now = new Date().toISOString();
      setC((prev) => {
        const next = { ...prev, updatedAt: now };
        if (typeof body.status === "string") next.status = body.status as ErdrCase["status"];
        if (typeof body.suspect === "string") next.suspect = body.suspect;
        if (Array.isArray(body.articles)) next.articles = body.articles as string[];
        if (typeof body.entry === "string" && body.entry.trim()) {
          next.entries = [...prev.entries, { id: now, text: body.entry, author: "Ви", at: now }];
        }
        if (body.assignSelf) next.investigatorId = "self";
        return next;
      });
      if (okMsg) toast(okMsg, "success");
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal onClose={onClose} title={`Провадження ${c.number}`} wide>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          {ERDR_STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => patch({ status: s.key }, "Статус оновлено")}
              disabled={busy}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                c.status === s.key ? "text-white" : "text-ice/60 hover:text-white"
              }`}
              style={c.status === s.key ? { background: s.color } : { border: "1px solid rgba(255,255,255,0.12)" }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ice/45">Статті</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {c.articles.map((a) => (
                <span key={a} className="rounded bg-white/8 px-2 py-1 text-xs text-ice/80">
                  ст. {a} — {articleTitle(a)}
                </span>
              ))}
              {c.articles.length === 0 && <span className="text-sm text-ice/40">не кваліфіковано</span>}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ice/45">Сторони</p>
            <p className="mt-1 text-sm text-ice/80">Заявник: {c.applicant || "—"}</p>
            <p className="text-sm text-ice/80">Підозрюваний: {c.suspect || "—"}</p>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ice/45">Фабула</p>
          <p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-ice/85">{c.fabula}</p>
        </div>

        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ice/45">Підпис слідчого</p>
          <SignatureUpload value={c.signature} onChange={(url) => patch({ signature: url }, "Підпис оновлено")} dark />
          {c.applicantSignature && (
            <div className="mt-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ice/45">Підпис заявника</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.applicantSignature} alt="Підпис заявника" className="h-14 w-40 rounded bg-white object-contain" />
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ice/45">
            Журнал дій
          </p>
          <div className="space-y-2">
            {[...c.entries].reverse().map((e) => (
              <div key={e.id} className="rounded-lg border border-white/8 bg-navy-950/40 px-3 py-2">
                <p className="text-sm text-ice/85">{e.text}</p>
                <p className="mt-0.5 text-[11px] text-ice/40">
                  {e.author} · {fmt(e.at)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 rounded-xl border border-white/12 bg-navy-950/60 px-4 py-2.5 text-sm text-white focus:border-navy-400 focus:outline-none"
              placeholder="Додати запис до журналу…"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && entry.trim()) {
                  patch({ entry }, "Запис додано");
                  setEntry("");
                }
              }}
            />
            <button
              onClick={() => {
                if (entry.trim()) {
                  patch({ entry }, "Запис додано");
                  setEntry("");
                }
              }}
              disabled={busy}
              className="btn-signal px-4"
            >
              Додати
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ---------- дрібні хелпери ---------- */
function Modal({
  children,
  onClose,
  title,
  wide,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[95] grid place-items-center bg-navy-950/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? "max-w-2xl" : "max-w-lg"} max-h-[88vh] overflow-y-auto rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-glow`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-head text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-steel hover:bg-white/10 hover:text-white">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Fld({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ice/45">{label}</p>
      {children}
    </div>
  );
}
function Inp({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      className="w-full rounded-xl border border-white/12 bg-navy-950/60 px-4 py-2.5 text-white focus:border-navy-400 focus:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

