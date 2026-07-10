"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { IconPlus, IconTrash, IconCheck } from "@/components/icons";
import { UNIT_ICONS, unitIcon } from "@/lib/unitIcons";
import { AdminCard, SectionHead, Field, AInput, ATextarea, ABtn, EmptyState } from "./ui";
import type { Unit } from "@/lib/types";

export function UnitsAdmin() {
  const toast = useToast();
  const [list, setList] = useState<Unit[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/units", { cache: "no-store" });
        setList(await r.json());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const upd = (i: number, patch: Partial<Unit>) =>
    setList((l) => l.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const add = () =>
    setList((l) => [
      ...l,
      {
        id: Math.random().toString(36).slice(2, 10),
        name: "",
        short: "",
        description: "",
        icon: "shield",
        order: l.length + 1,
      },
    ]);
  const del = (i: number) => setList((l) => l.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const copy = [...list];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setList(copy);
  };

  const save = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/units", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });
      if (!r.ok) throw new Error();
      toast("Підрозділи збережено", "success");
    } catch {
      toast("Не вдалося зберегти", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHead
        title="Підрозділи"
        desc="Картки підрозділів на головній сторінці"
        action={
          <div className="flex gap-2">
            <ABtn variant="ghost" onClick={add}>
              <IconPlus width={16} height={16} /> Додати
            </ABtn>
            <ABtn variant="signal" onClick={save} disabled={saving}>
              <IconCheck width={16} height={16} /> {saving ? "Збереження…" : "Зберегти все"}
            </ABtn>
          </div>
        }
      />

      {loading ? (
        <EmptyState text="Завантаження…" />
      ) : list.length === 0 ? (
        <EmptyState text="Підрозділів немає — додай перший" />
      ) : (
        <div className="grid gap-4">
          {list.map((u, i) => {
            const Icon = unitIcon(u.icon);
            return (
              <AdminCard key={u.id} className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-ice/40">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy-600/30 text-navy-300">
                      <Icon width={16} height={16} />
                    </span>
                    Підрозділ {i + 1}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-white/12 text-ice/60 transition hover:text-white disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === list.length - 1}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-white/12 text-ice/60 transition hover:text-white disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <ABtn variant="danger" onClick={() => del(i)}>
                      <IconTrash width={15} height={15} />
                    </ABtn>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
                    <Field label="Назва">
                      <AInput value={u.name} onChange={(e) => upd(i, { name: e.target.value })} />
                    </Field>
                    <Field label="Іконка">
                      <select
                        value={u.icon}
                        onChange={(e) => upd(i, { icon: e.target.value })}
                        className="w-full rounded-xl border border-white/12 bg-navy-950/60 px-4 py-2.5 text-[15px] text-white transition focus:border-navy-400 focus:outline-none focus:ring-4 focus:ring-navy-400/15"
                      >
                        {UNIT_ICONS.map((ic) => (
                          <option key={ic.key} value={ic.key} className="bg-navy-900">
                            {ic.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Короткий підпис" hint="під назвою">
                    <AInput value={u.short} onChange={(e) => upd(i, { short: e.target.value })} />
                  </Field>
                  <Field label="Опис" hint="показується при відкритті картки">
                    <ATextarea
                      rows={3}
                      value={u.description}
                      onChange={(e) => upd(i, { description: e.target.value })}
                    />
                  </Field>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
