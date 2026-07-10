"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { IconPlus, IconTrash, IconCheck, IconClose, IconPlay, IconImage } from "@/components/icons";
import { ImageField } from "./ImageField";
import {
  AdminCard,
  SectionHead,
  Field,
  AInput,
  ABtn,
  EmptyState,
} from "./ui";
import type { GalleryItem } from "@/lib/types";

type Draft = Partial<GalleryItem>;
const empty: Draft = { type: "image", src: "", poster: "", caption: "" };

export function GalleryAdmin() {
  const toast = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/gallery", { cache: "no-store" });
      setItems(await r.json());
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!draft?.src?.trim()) {
      toast("Вкажи посилання на медіа", "error");
      return;
    }
    setSaving(true);
    try {
      const r = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!r.ok) throw new Error();
      toast("Додано до галереї", "success");
      setDraft(null);
      await load();
    } catch {
      toast("Не вдалося додати", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Видалити цей елемент?")) return;
    const r = await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (r.ok) {
      toast("Видалено", "success");
      setItems((x) => x.filter((g) => g.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <SectionHead
        title="Галерея"
        desc="Фото та відео управління"
        action={
          <ABtn variant="signal" onClick={() => setDraft({ ...empty })}>
            <IconPlus width={16} height={16} /> Додати медіа
          </ABtn>
        }
      />

      {draft && (
        <AdminCard className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-head text-lg font-semibold text-white">Новий елемент</h3>
            <button
              onClick={() => setDraft(null)}
              className="grid h-8 w-8 place-items-center rounded-lg text-ice/50 transition hover:bg-white/10 hover:text-white"
            >
              <IconClose width={18} height={18} />
            </button>
          </div>
          <div className="grid gap-4">
            <Field label="Тип">
              <div className="flex gap-2">
                {(["image", "video"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setDraft({ ...draft, type: t })}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                      draft.type === t
                        ? "border-signal/50 bg-signal/15 text-signal"
                        : "border-white/12 bg-navy-950/60 text-ice/60 hover:text-white"
                    }`}
                  >
                    {t === "image" ? (
                      <IconImage width={16} height={16} />
                    ) : (
                      <IconPlay width={16} height={16} />
                    )}
                    {t === "image" ? "Фото" : "Відео"}
                  </button>
                ))}
              </div>
            </Field>
            <ImageField
              label={draft.type === "video" ? "Відео" : "Зображення"}
              value={draft.src || ""}
              onChange={(url) => setDraft({ ...draft, src: url })}
              accept={draft.type === "video" ? "video/mp4" : "image/*"}
              isVideo={draft.type === "video"}
            />
            {draft.type === "video" && (
              <ImageField
                label="Постер (превʼю відео)"
                hint="необовʼязково, зображення"
                value={draft.poster || ""}
                onChange={(url) => setDraft({ ...draft, poster: url })}
              />
            )}
            <Field label="Підпис">
              <AInput
                value={draft.caption || ""}
                onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
              />
            </Field>
            <div className="flex gap-3">
              <ABtn variant="signal" onClick={save} disabled={saving}>
                <IconCheck width={16} height={16} /> {saving ? "Збереження…" : "Додати"}
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
        <EmptyState text="Галерея порожня" />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((g) => (
            <div
              key={g.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-navy-950"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${g.type === "video" ? g.poster || g.src : g.src})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent" />
              {g.type === "video" && (
                <span className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-md bg-navy-950/70 text-white">
                  <IconPlay width={14} height={14} />
                </span>
              )}
              <p className="absolute inset-x-2 bottom-2 truncate text-xs font-medium text-white">
                {g.caption || "Без підпису"}
              </p>
              <button
                onClick={() => remove(g.id)}
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md bg-bad/80 text-white opacity-0 transition group-hover:opacity-100"
              >
                <IconTrash width={14} height={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
