"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { IconPlus, IconTrash, IconCheck } from "@/components/icons";
import { AdminCard, SectionHead, Field, AInput, ABtn, EmptyState } from "./ui";
import type { ApplicationQuestion } from "@/lib/types";

export function FormAdmin() {
  const toast = useToast();
  const [list, setList] = useState<ApplicationQuestion[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/form", { cache: "no-store" });
        setList(await r.json());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const upd = (i: number, patch: Partial<ApplicationQuestion>) =>
    setList((l) => l.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const add = () =>
    setList((l) => [
      ...l,
      { id: Math.random().toString(36).slice(2, 10), label: "", type: "short", required: false },
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
      const r = await fetch("/api/form", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });
      if (!r.ok) throw new Error();
      toast("Форму заявки збережено", "success");
    } catch {
      toast("Не вдалося зберегти", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHead
        title="Форма заявки"
        desc="Питання, які бачить кандидат"
        action={
          <div className="flex gap-2">
            <ABtn variant="ghost" onClick={add}>
              <IconPlus width={16} height={16} /> Питання
            </ABtn>
            <ABtn variant="signal" onClick={save} disabled={saving}>
              <IconCheck width={16} height={16} /> {saving ? "Збереження…" : "Зберегти все"}
            </ABtn>
          </div>
        }
      />

      <AdminCard className="p-4">
        <p className="text-sm text-ice/55">
          Поля <span className="text-white">Ім'я, Прізвище, Discord, Вік</span> запитуються завжди —
          їх змінювати не треба. Нижче — додаткові питання, які ти можеш додавати, прибирати,
          перейменовувати й робити обов'язковими.
        </p>
      </AdminCard>

      {loading ? (
        <EmptyState text="Завантаження…" />
      ) : list.length === 0 ? (
        <EmptyState text="Додаткових питань немає" />
      ) : (
        <div className="grid gap-3">
          {list.map((q, i) => (
            <AdminCard key={q.id} className="grid items-end gap-3 p-4 sm:grid-cols-[1fr_150px_auto_auto]">
              <Field label={`Питання ${i + 1}`}>
                <AInput value={q.label} onChange={(e) => upd(i, { label: e.target.value })} />
              </Field>
              <Field label="Тип відповіді">
                <select
                  value={q.type}
                  onChange={(e) => upd(i, { type: e.target.value as "short" | "long" })}
                  className="w-full rounded-xl border border-white/12 bg-navy-950/60 px-4 py-2.5 text-[15px] text-white transition focus:border-navy-400 focus:outline-none focus:ring-4 focus:ring-navy-400/15"
                >
                  <option value="short" className="bg-navy-900">
                    Короткий рядок
                  </option>
                  <option value="long" className="bg-navy-900">
                    Довгий текст
                  </option>
                </select>
              </Field>
              <button
                type="button"
                onClick={() => upd(i, { required: !q.required })}
                className={`h-[46px] rounded-xl border px-3 text-sm font-semibold transition ${
                  q.required
                    ? "border-signal/50 bg-signal/15 text-signal"
                    : "border-white/12 bg-navy-950/60 text-ice/50 hover:text-white"
                }`}
              >
                {q.required ? "Обов'язкове" : "Необов'язкове"}
              </button>
              <div className="flex gap-1.5">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="grid h-[46px] w-9 place-items-center rounded-xl border border-white/12 text-ice/60 transition hover:text-white disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === list.length - 1}
                  className="grid h-[46px] w-9 place-items-center rounded-xl border border-white/12 text-ice/60 transition hover:text-white disabled:opacity-30"
                >
                  ↓
                </button>
                <ABtn variant="danger" className="h-[46px]" onClick={() => del(i)}>
                  <IconTrash width={15} height={15} />
                </ABtn>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
