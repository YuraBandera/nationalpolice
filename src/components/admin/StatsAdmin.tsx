"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { IconPlus, IconTrash, IconCheck } from "@/components/icons";
import { AdminCard, SectionHead, Field, AInput, ABtn, EmptyState } from "./ui";
import type { StatItem } from "@/lib/types";

export function StatsAdmin() {
  const toast = useToast();
  const [list, setList] = useState<StatItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/stats", { cache: "no-store" });
        setList(await r.json());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const upd = (i: number, patch: Partial<StatItem>) =>
    setList((l) => l.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const add = () =>
    setList((l) => [
      ...l,
      { id: Math.random().toString(36).slice(2, 10), label: "", value: 0, suffix: "" },
    ]);
  const del = (i: number) => setList((l) => l.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });
      if (!r.ok) throw new Error();
      toast("Статистику збережено", "success");
    } catch {
      toast("Не вдалося зберегти", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHead
        title="Статистика"
        desc="Лічильники на головній сторінці"
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
        <EmptyState text="Показників немає" />
      ) : (
        <div className="grid gap-3">
          {list.map((s, i) => (
            <AdminCard key={s.id} className="grid items-end gap-3 p-4 sm:grid-cols-[1fr_130px_110px_auto]">
              <Field label="Назва">
                <AInput value={s.label} onChange={(e) => upd(i, { label: e.target.value })} />
              </Field>
              <Field label="Значення">
                <AInput
                  type="number"
                  value={s.value}
                  onChange={(e) => upd(i, { value: Number(e.target.value) })}
                />
              </Field>
              <Field label="Суфікс" hint="+, %">
                <AInput
                  value={s.suffix || ""}
                  onChange={(e) => upd(i, { suffix: e.target.value })}
                  placeholder="+"
                />
              </Field>
              <ABtn variant="danger" onClick={() => del(i)}>
                <IconTrash width={15} height={15} />
              </ABtn>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
