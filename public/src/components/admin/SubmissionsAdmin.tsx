"use client";

import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/Toast";
import { IconTrash, IconFile, IconAlert, IconClose } from "@/components/icons";
import { AdminCard, SectionHead, ABtn, StatusTag, EmptyState } from "./ui";
import type { Application, Complaint } from "@/lib/types";

type Kind = "applications" | "complaints";
type Row = Application | Complaint;

const APP_STATUSES = ["new", "reviewed", "accepted", "rejected"] as const;
const CMP_STATUSES = ["new", "reviewed", "resolved"] as const;

const STATUS_LABEL: Record<string, string> = {
  new: "Нова",
  reviewed: "Розглянуто",
  accepted: "Прийнято",
  rejected: "Відхилено",
  resolved: "Вирішено",
};

function fmt(iso: string) {
  try {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const APP_FIELDS: { key: keyof Application; label: string }[] = [
  { key: "steam", label: "Steam" },
  { key: "timezone", label: "Часовий пояс" },
  { key: "rpExperience", label: "Досвід RolePlay" },
  { key: "whyJoin", label: "Чому хоче вступити" },
  { key: "whyGunp", label: "Чому саме ГУНП" },
  { key: "punishments", label: "Покарання" },
  { key: "extra", label: "Додатково" },
];

const CMP_FIELDS: { key: keyof Complaint; label: string }[] = [
  { key: "nickname", label: "Нікнейм" },
  { key: "against", label: "На кого скарга" },
  { key: "unit", label: "Підрозділ" },
  { key: "date", label: "Дата події" },
  { key: "description", label: "Опис ситуації" },
  { key: "evidence", label: "Докази" },
];

export function SubmissionsAdmin({ kind }: { kind: Kind }) {
  const toast = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Row | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const statuses = kind === "applications" ? APP_STATUSES : CMP_STATUSES;

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/${kind}`, { cache: "no-store" });
      if (r.ok) setRows(await r.json());
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [kind]);

  const setStatus = async (id: string, status: string) => {
    const r = await fetch(`/api/${kind}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (r.ok) {
      setRows((x) => x.map((row) => (row.id === id ? { ...row, status: status as never } : row)));
      setActive((a) => (a && a.id === id ? { ...a, status: status as never } : a));
      toast("Статус оновлено", "success");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Видалити це звернення?")) return;
    const r = await fetch(`/api/${kind}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (r.ok) {
      setRows((x) => x.filter((row) => row.id !== id));
      setActive(null);
      toast("Видалено", "success");
    }
  };

  const filtered = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter]
  );

  const title = (r: Row) =>
    kind === "applications"
      ? `${(r as Application).firstName} ${(r as Application).lastName}`.trim() || "Без імені"
      : `Скарга на ${(r as Complaint).against || "—"}`;

  const fields = kind === "applications" ? APP_FIELDS : CMP_FIELDS;
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const s of statuses) c[s] = rows.filter((r) => r.status === s).length;
    return c;
  }, [rows, statuses]);

  return (
    <div className="space-y-6">
      <SectionHead
        title={kind === "applications" ? "Заявки на вступ" : "Скарги"}
        desc={
          kind === "applications"
            ? "Анкети кандидатів до управління"
            : "Звернення щодо дій працівників"
        }
      />

      <div className="flex flex-wrap gap-2">
        {(["all", ...statuses] as string[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              filter === s
                ? "border-signal/40 bg-signal/15 text-signal"
                : "border-white/12 bg-navy-950/50 text-ice/55 hover:text-white"
            }`}
          >
            {s === "all" ? "Усі" : STATUS_LABEL[s]}
            <span className="ml-1.5 text-ice/40">{counts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <EmptyState text="Завантаження…" />
      ) : filtered.length === 0 ? (
        <EmptyState text="Звернень немає" />
      ) : (
        <div className="grid gap-3">
          {filtered.map((r) => (
            <AdminCard key={r.id} className="flex items-center gap-4 p-4">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                  kind === "applications"
                    ? "bg-navy-500/15 text-navy-300"
                    : "bg-bad/12 text-bad"
                }`}
              >
                {kind === "applications" ? (
                  <IconFile width={18} height={18} />
                ) : (
                  <IconAlert width={18} height={18} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-head font-semibold text-white">{title(r)}</p>
                <p className="mt-0.5 truncate text-xs text-ice/50">
                  {(r as Application).discord} · {fmt(r.createdAt)}
                </p>
              </div>
              <StatusTag status={r.status} />
              <ABtn variant="ghost" onClick={() => setActive(r)}>
                Відкрити
              </ABtn>
            </AdminCard>
          ))}
        </div>
      )}

      {active && (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-navy-950/80 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setActive(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-white/12 bg-navy-900 shadow-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
              <div>
                <p className="font-head text-lg font-semibold text-white">{title(active)}</p>
                <p className="mt-1 text-xs text-ice/50">{fmt(active.createdAt)}</p>
              </div>
              <button
                onClick={() => setActive(null)}
                className="grid h-9 w-9 place-items-center rounded-lg text-ice/50 transition hover:bg-white/10 hover:text-white"
              >
                <IconClose width={18} height={18} />
              </button>
            </div>

            <div className="max-h-[55vh] space-y-4 overflow-y-auto p-5">
              <DetailRow label="Discord" value={(active as Application).discord} />
              {kind === "applications" && (
                <DetailRow label="Вік" value={(active as Application).age} />
              )}
              {fields.map((f) => {
                const v = (active as never)[f.key] as string;
                if (!v) return null;
                return <DetailRow key={String(f.key)} label={f.label} value={v} />;
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-white/10 p-5">
              <span className="mr-1 text-xs font-semibold uppercase tracking-[0.12em] text-ice/45">
                Статус:
              </span>
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(active.id, s)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    active.status === s
                      ? "border-signal/50 bg-signal/15 text-signal"
                      : "border-white/12 bg-navy-950/60 text-ice/60 hover:text-white"
                  }`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
              <ABtn variant="danger" className="ml-auto" onClick={() => remove(active.id)}>
                <IconTrash width={15} height={15} /> Видалити
              </ABtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-navy-950/50 p-4">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ice/45">
        {label}
      </p>
      <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-ice/85">
        {value}
      </p>
    </div>
  );
}
