"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { IconPlus, IconTrash, IconCheck } from "@/components/icons";
import { statusLabel, statusColor } from "@/lib/kkArticles";
import { AdminCard, SectionHead, Field, AInput, ABtn, EmptyState } from "./ui";

interface Inv {
  id: string;
  login: string;
  name: string;
  rank: string;
  active: boolean;
  createdAt: string;
}
interface ErdrCaseLite {
  id: string;
  number: string;
  articles: string[];
  status: string;
  source: string;
  applicant: string;
  suspect: string;
  createdAt: string;
}

export function ErdrAdmin() {
  const toast = useToast();
  const [list, setList] = useState<Inv[]>([]);
  const [cases, setCases] = useState<ErdrCaseLite[]>([]);
  const [loading, setLoading] = useState(true);

  // нова форма
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

  async function create() {
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
    if (!r.ok) {
      toast(d.error || "Не вдалося створити", "error");
      return;
    }
    toast("Слідчого додано", "success");
    setLogin("");
    setPassword("");
    setName("");
    setRank("Слідчий");
    load();
  }

  async function patch(id: string, body: Record<string, unknown>, msg?: string) {
    const r = await fetch("/api/investigators", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    if (r.ok) {
      if (msg) toast(msg, "success");
      load();
    } else toast("Помилка", "error");
  }

  async function remove(id: string) {
    const r = await fetch("/api/investigators", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (r.ok) {
      toast("Акаунт видалено", "success");
      load();
    }
  }

  async function resetPass(id: string) {
    const np = prompt("Новий пароль (мінімум 4 символи):");
    if (!np || np.length < 4) return;
    patch(id, { password: np }, "Пароль оновлено");
  }

  return (
    <div className="space-y-8">
      <SectionHead title="ЄРДР — слідчі" desc="Акаунти для входу в панель слідчого" />

      <AdminCard className="p-5">
        <p className="mb-4 text-sm font-semibold text-white">Додати слідчого</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Логін" hint="для входу">
            <AInput value={login} onChange={(e) => setLogin(e.target.value)} placeholder="напр. slidchyi_01" />
          </Field>
          <Field label="Пароль">
            <AInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="мінімум 4 символи" />
          </Field>
          <Field label="ПІБ / ім'я">
            <AInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Олександр Ткаченко" />
          </Field>
          <Field label="Посада / звання">
            <AInput value={rank} onChange={(e) => setRank(e.target.value)} />
          </Field>
        </div>
        <div className="mt-4">
          <ABtn variant="signal" onClick={create}>
            <IconPlus width={16} height={16} /> Створити акаунт
          </ABtn>
        </div>
      </AdminCard>

      {loading ? (
        <EmptyState text="Завантаження…" />
      ) : list.length === 0 ? (
        <EmptyState text="Акаунтів слідчих ще немає" />
      ) : (
        <div className="grid gap-3">
          {list.map((i) => (
            <AdminCard key={i.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-head font-semibold text-white">
                  {i.name || i.login}{" "}
                  <span className="ml-1 font-mono text-xs font-normal text-ice/45">@{i.login}</span>
                </p>
                <p className="text-sm text-ice/50">{i.rank}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  i.active ? "bg-good/15 text-good" : "bg-bad/15 text-bad"
                }`}
              >
                {i.active ? "Активний" : "Вимкнено"}
              </span>
              <div className="flex gap-1.5">
                <ABtn variant="ghost" onClick={() => patch(i.id, { active: !i.active }, "Оновлено")}>
                  {i.active ? "Вимкнути" : "Увімкнути"}
                </ABtn>
                <ABtn variant="ghost" onClick={() => resetPass(i.id)}>
                  Пароль
                </ABtn>
                <ABtn variant="danger" onClick={() => remove(i.id)}>
                  <IconTrash width={15} height={15} />
                </ABtn>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <SectionHead title="Провадження" desc="Усі записи реєстру" />
      {cases.length === 0 ? (
        <EmptyState text="Проваджень ще немає" />
      ) : (
        <div className="grid gap-2">
          {cases.map((c) => (
            <AdminCard key={c.id} className="flex flex-wrap items-center gap-3 p-3.5">
              <span className="font-mono text-sm font-semibold text-white">{c.number}</span>
              <span className="flex flex-wrap gap-1">
                {c.articles.map((a) => (
                  <span key={a} className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-[11px] text-ice/60">
                    {a}
                  </span>
                ))}
              </span>
              <span className="ml-auto flex items-center gap-2">
                {c.source === "citizen" && (
                  <span className="rounded bg-signal/15 px-2 py-0.5 text-[11px] font-semibold text-signal">заява</span>
                )}
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                  style={{ background: statusColor(c.status) }}
                >
                  {statusLabel(c.status)}
                </span>
              </span>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
