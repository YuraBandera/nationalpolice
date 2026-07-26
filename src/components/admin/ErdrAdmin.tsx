"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { IconPlus, IconTrash } from "@/components/icons";
import { statusLabel, statusColor, ERDR_STATUSES, articleTitle } from "@/lib/kkArticles";
import { ArticlePicker } from "@/components/erdr/ArticlePicker";
import { AdminCard, SectionHead, Field, AInput, ABtn, EmptyState } from "./ui";
import type { ErdrCase } from "@/lib/types";

interface Inv {
  id: string;
  login: string;
  name: string;
  rank: string;
  active: boolean;
  createdAt: string;
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

export function ErdrAdmin() {
  const toast = useToast();
  const [list, setList] = useState<Inv[]>([]);
  const [cases, setCases] = useState<ErdrCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<ErdrCase | null>(null);
  const [creating, setCreating] = useState(false);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rank, setRank] = useState("Слідчий");

  async function load() {
    try {
      const [ri, rc] = await Promise.all([
        fetch("/api/investigators", { cache: "no-store" }),
        fetch("/api/erdr/cases-admin", { cache: "no-store" }),
      ]);
      if (ri.ok) setList(await ri.json());
      if (rc.ok) setCases(await rc.json());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function createInv() {
    if (login.trim().length < 3 || password.length < 4) {
      toast("Логін від 3, пароль від 4 символів", "error");
      return;
    }
    const r = await fetch("/api/investigators", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password, name, rank }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return toast(d.error || "Не вдалося створити", "error");
    toast("Слідчого додано", "success");
    setLogin(""); setPassword(""); setName(""); setRank("Слідчий");
    load();
  }
  async function patchInv(id: string, body: Record<string, unknown>, msg?: string) {
    const r = await fetch("/api/investigators", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    if (r.ok) { if (msg) toast(msg, "success"); load(); } else toast("Помилка", "error");
  }
  async function removeInv(id: string) {
    const r = await fetch("/api/investigators", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }),
    });
    if (r.ok) { toast("Акаунт видалено", "success"); load(); }
  }
  function resetPass(id: string) {
    const np = prompt("Новий пароль (мінімум 4 символи):");
    if (!np || np.length < 4) return;
    patchInv(id, { password: np }, "Пароль оновлено");
  }

  return (
    <div className="space-y-8">
      <SectionHead
        title="ЄРДР — провадження"
        desc="Повне керування реєстром"
        action={
          <ABtn variant="signal" onClick={() => setCreating(true)}>
            <IconPlus width={16} height={16} /> Нове провадження
          </ABtn>
        }
      />

      {loading ? (
        <EmptyState text="Завантаження…" />
      ) : cases.length === 0 ? (
        <EmptyState text="Проваджень ще немає" />
      ) : (
        <div className="grid gap-2">
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => setOpen(c)}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-white/8 bg-white/[0.04] p-3.5 text-left transition hover:border-navy-400/40 hover:bg-white/[0.07]"
            >
              <span className="font-mono text-sm font-semibold text-white">{c.number}</span>
              <span className="flex flex-wrap gap-1">
                {c.articles.map((a) => (
                  <span key={a} className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-[11px] text-ice/60">{a}</span>
                ))}
              </span>
              <span className="ml-auto flex items-center gap-2">
                {c.source === "citizen" && (
                  <span className="rounded bg-signal/15 px-2 py-0.5 text-[11px] font-semibold text-signal">заява</span>
                )}
                <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white" style={{ background: statusColor(c.status) }}>
                  {statusLabel(c.status)}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {/* --- слідчі --- */}
      <SectionHead title="Акаунти слідчих" desc="Доступ до панелі слідчого" />
      <AdminCard className="p-5">
        <p className="mb-4 text-sm font-semibold text-white">Додати слідчого</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Логін" hint="для входу"><AInput value={login} onChange={(e) => setLogin(e.target.value)} placeholder="напр. slidchyi_01" /></Field>
          <Field label="Пароль"><AInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="мінімум 4 символи" /></Field>
          <Field label="ПІБ / ім'я"><AInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Олександр Ткаченко" /></Field>
          <Field label="Посада / звання"><AInput value={rank} onChange={(e) => setRank(e.target.value)} /></Field>
        </div>
        <div className="mt-4"><ABtn variant="signal" onClick={createInv}><IconPlus width={16} height={16} /> Створити акаунт</ABtn></div>
      </AdminCard>

      {list.length === 0 ? (
        <EmptyState text="Акаунтів слідчих ще немає" />
      ) : (
        <div className="grid gap-3">
          {list.map((i) => (
            <AdminCard key={i.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-head font-semibold text-white">
                  {i.name || i.login} <span className="ml-1 font-mono text-xs font-normal text-ice/45">@{i.login}</span>
                </p>
                <p className="text-sm text-ice/50">{i.rank}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${i.active ? "bg-good/15 text-good" : "bg-bad/15 text-bad"}`}>
                {i.active ? "Активний" : "Вимкнено"}
              </span>
              <div className="flex gap-1.5">
                <ABtn variant="ghost" onClick={() => patchInv(i.id, { active: !i.active }, "Оновлено")}>{i.active ? "Вимкнути" : "Увімкнути"}</ABtn>
                <ABtn variant="ghost" onClick={() => resetPass(i.id)}>Пароль</ABtn>
                <ABtn variant="danger" onClick={() => removeInv(i.id)}><IconTrash width={15} height={15} /></ABtn>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {creating && <CaseEditor onClose={() => setCreating(false)} onSaved={() => { setCreating(false); load(); }} />}
      {open && <CaseEditor item={open} onClose={() => setOpen(null)} onSaved={() => { setOpen(null); load(); }} />}
    </div>
  );
}

/* ---------- Редактор провадження (створення + повне редагування + видалення) ---------- */
function CaseEditor({ item, onClose, onSaved }: { item?: ErdrCase; onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const editing = !!item;
  const [articles, setArticles] = useState<string[]>(item?.articles || []);
  const [fabula, setFabula] = useState(item?.fabula || "");
  const [applicant, setApplicant] = useState(item?.applicant || "");
  const [suspect, setSuspect] = useState(item?.suspect || "");
  const [status, setStatus] = useState(item?.status || "registered");
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState(item?.entries || []);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      if (editing) {
        const r = await fetch("/api/erdr/cases-admin", {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item!.id, articles, fabula, applicant, suspect, status }),
        });
        if (!r.ok) return toast("Не вдалося зберегти", "error");
        toast("Провадження оновлено", "success");
      } else {
        const r = await fetch("/api/erdr/cases-admin", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articles, fabula, applicant, suspect, status }),
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) return toast(d.error || "Не вдалося створити", "error");
        toast("Провадження створено", "success");
      }
      onSaved();
    } finally {
      setBusy(false);
    }
  }

  async function addEntry() {
    if (!entry.trim() || !item) return;
    const r = await fetch("/api/erdr/cases-admin", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, entry }),
    });
    if (r.ok) {
      setEntries((p) => [...p, { id: String(Date.now()), text: entry, author: "Адміністратор", at: new Date().toISOString() }]);
      setEntry("");
      toast("Запис додано", "success");
    }
  }

  async function del() {
    if (!item) return;
    if (!confirm("Видалити провадження безповоротно?")) return;
    const r = await fetch("/api/erdr/cases-admin", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id }),
    });
    if (r.ok) { toast("Провадження видалено", "success"); onSaved(); }
  }

  return (
    <div className="fixed inset-0 z-[95] grid place-items-center bg-navy-950/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-glow">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-head text-lg font-bold text-white">
            {editing ? `Провадження ${item!.number}` : "Нове провадження"}
          </h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-steel hover:bg-white/10 hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {ERDR_STATUSES.map((s) => (
              <button
                key={s.key}
                onClick={() => setStatus(s.key as ErdrCase["status"])}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${status === s.key ? "text-white" : "text-ice/60 hover:text-white"}`}
                style={status === s.key ? { background: s.color } : { border: "1px solid rgba(255,255,255,0.12)" }}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ice/45">Статті ККУ</p>
            <ArticlePicker value={articles} onChange={setArticles} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Заявник (Roblox)"><AInput value={applicant} onChange={(e) => setApplicant(e.target.value)} /></Field>
            <Field label="Підозрюваний (Roblox)"><AInput value={suspect} onChange={(e) => setSuspect(e.target.value)} /></Field>
          </div>

          <Field label="Фабула">
            <textarea
              className="min-h-[100px] w-full resize-y rounded-xl border border-white/12 bg-navy-950/60 px-4 py-2.5 text-white focus:border-navy-400 focus:outline-none"
              value={fabula} onChange={(e) => setFabula(e.target.value)}
            />
          </Field>

          {editing && (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ice/45">Журнал дій</p>
              <div className="space-y-2">
                {[...entries].reverse().map((e) => (
                  <div key={e.id} className="rounded-lg border border-white/8 bg-navy-950/40 px-3 py-2">
                    <p className="text-sm text-ice/85">{e.text}</p>
                    <p className="mt-0.5 text-[11px] text-ice/40">{e.author} · {fmt(e.at)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-white/12 bg-navy-950/60 px-4 py-2.5 text-sm text-white focus:border-navy-400 focus:outline-none"
                  placeholder="Додати запис…" value={entry} onChange={(e) => setEntry(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addEntry()}
                />
                <ABtn variant="ghost" onClick={addEntry}>Додати</ABtn>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <ABtn variant="signal" onClick={save} disabled={busy}>{editing ? "Зберегти" : "Створити"}</ABtn>
            {editing && <ABtn variant="danger" onClick={del}><IconTrash width={15} height={15} /> Видалити</ABtn>}
          </div>
        </div>
      </div>
    </div>
  );
}
