"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { IconPlus, IconTrash, IconCheck } from "@/components/icons";
import { AdminCard, SectionHead, Field, AInput, ATextarea, ABtn, EmptyState } from "./ui";
import type { Leader } from "@/lib/types";

export function LeadershipAdmin() {
  const toast = useToast();
  const [list, setList] = useState<Leader[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/leadership", { cache: "no-store" });
        setList(await r.json());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const upd = (i: number, patch: Partial<Leader>) =>
    setList((l) => l.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  const add = () =>
    setList((l) => [
      ...l,
      { id: Math.random().toString(36).slice(2, 10), name: "", rank: "", photo: "", bio: "", order: l.length + 1 },
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
      const r = await fetch("/api/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });
      if (!r.ok) throw new Error();
      toast("Керівництво збережено", "success");
    } catch {
      toast("Не вдалося зберегти", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHead
        title="Керівництво"
        desc="Картки командного складу"
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
        <EmptyState text="Список порожній — додай першого керівника" />
      ) : (
        <div className="grid gap-4">
          {list.map((l, i) => (
            <AdminCard key={l.id} className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-ice/40">
                  Позиція {i + 1}
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="ПІБ">
                    <AInput value={l.name} onChange={(e) => upd(i, { name: e.target.value })} />
                  </Field>
                  <Field label="Посада">
                    <AInput value={l.rank} onChange={(e) => upd(i, { rank: e.target.value })} />
                  </Field>
                </div>
                <Field label="Посилання на фото" hint="URL, необовʼязково">
                  <AInput
                    value={l.photo}
                    onChange={(e) => upd(i, { photo: e.target.value })}
                    placeholder="https://..."
                  />
                </Field>
                <Field label="Короткий опис">
                  <ATextarea rows={2} value={l.bio} onChange={(e) => upd(i, { bio: e.target.value })} />
                </Field>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
