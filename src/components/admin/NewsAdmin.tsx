"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { fmtDate } from "@/components/NewsSection";
import { IconPlus, IconEdit, IconTrash, IconCheck, IconClose } from "@/components/icons";
import {
  AdminCard,
  SectionHead,
  Field,
  AInput,
  ATextarea,
  ABtn,
  EmptyState,
} from "./ui";
import type { NewsItem } from "@/lib/types";

type Draft = Partial<NewsItem>;
const empty: Draft = { title: "", author: "Пресслужба ГУНП", image: "", excerpt: "", body: "" };

export function NewsAdmin() {
  const toast = useToast();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/news", { cache: "no-store" });
      setItems(await r.json());
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!draft?.title?.trim()) {
      toast("Потрібен заголовок", "error");
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!draft.id;
      const r = await fetch("/api/news", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          date: draft.date || new Date().toISOString(),
        }),
      });
      if (!r.ok) throw new Error();
      toast(isEdit ? "Новину оновлено" : "Новину опубліковано", "success");
      setDraft(null);
      await load();
    } catch {
      toast("Не вдалося зберегти", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Видалити цю новину?")) return;
    const r = await fetch("/api/news", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (r.ok) {
      toast("Новину видалено", "success");
      setItems((x) => x.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <SectionHead
        title="Новини"
        desc="Публікації хроніки управління"
        action={
          <ABtn variant="signal" onClick={() => setDraft({ ...empty })}>
            <IconPlus width={16} height={16} /> Додати новину
          </ABtn>
        }
      />

      {draft && (
        <AdminCard className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-head text-lg font-semibold text-white">
              {draft.id ? "Редагувати новину" : "Нова новина"}
            </h3>
            <button
              onClick={() => setDraft(null)}
              className="grid h-8 w-8 place-items-center rounded-lg text-ice/50 transition hover:bg-white/10 hover:text-white"
            >
              <IconClose width={18} height={18} />
            </button>
          </div>
          <div className="grid gap-4">
            <Field label="Заголовок">
              <AInput
                value={draft.title || ""}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Наприклад: Підсумки нічного чергування"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Автор">
                <AInput
                  value={draft.author || ""}
                  onChange={(e) => setDraft({ ...draft, author: e.target.value })}
                />
              </Field>
              <Field label="Дата" hint="залиш порожнім — стане поточна">
                <AInput
                  type="date"
                  value={draft.date ? draft.date.slice(0, 10) : ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      date: e.target.value ? new Date(e.target.value).toISOString() : "",
                    })
                  }
                />
              </Field>
            </div>
            <Field label="Посилання на фото" hint="URL">
              <AInput
                value={draft.image || ""}
                onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                placeholder="https://..."
              />
            </Field>
            <Field label="Короткий опис" hint="анонс у картці">
              <ATextarea
                rows={2}
                value={draft.excerpt || ""}
                onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
              />
            </Field>
            <Field label="Повний текст">
              <ATextarea
                rows={7}
                value={draft.body || ""}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              />
            </Field>
            <div className="flex gap-3">
              <ABtn variant="signal" onClick={save} disabled={saving}>
                <IconCheck width={16} height={16} /> {saving ? "Збереження…" : "Зберегти"}
              </ABtn>
              <ABtn variant="ghost" onClick={() => setDraft(null)}>
                Скасувати
              </ABtn>
            </div>
          </div>
        </AdminCard>
      )}

      {loading ? (
        <EmptyState text="Завантаження…" />
      ) : items.length === 0 ? (
        <EmptyState text="Новин ще немає" />
      ) : (
        <div className="grid gap-3">
          {items.map((n) => (
            <AdminCard key={n.id} className="flex items-center gap-4 p-4">
              <div
                className="hidden h-14 w-20 shrink-0 rounded-lg bg-cover bg-center sm:block"
                style={{
                  backgroundImage: n.image
                    ? `url(${n.image})`
                    : "linear-gradient(135deg,#1b3a6b,#0b1c38)",
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-head font-semibold text-white">{n.title}</p>
                <p className="mt-0.5 text-xs text-ice/50">
                  {fmtDate(n.date)} · {n.author}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <ABtn variant="ghost" onClick={() => setDraft(n)}>
                  <IconEdit width={15} height={15} />
                </ABtn>
                <ABtn variant="danger" onClick={() => remove(n.id)}>
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
