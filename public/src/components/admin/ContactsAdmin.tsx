"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { IconPlus, IconTrash, IconCheck } from "@/components/icons";
import { AdminCard, SectionHead, Field, AInput, ABtn, EmptyState } from "./ui";
import type { Contacts } from "@/lib/types";

export function ContactsAdmin() {
  const toast = useToast();
  const [c, setC] = useState<Contacts | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/contacts", { cache: "no-store" });
      setC(await r.json());
    })();
  }, []);

  if (!c) {
    return (
      <div className="space-y-6">
        <SectionHead title="Контакти" desc="Дані звʼязку та посилання" />
        <EmptyState text="Завантаження…" />
      </div>
    );
  }

  const upd = (patch: Partial<Contacts>) => setC({ ...c, ...patch });
  const updSocial = (i: number, patch: Partial<Contacts["socials"][number]>) =>
    setC({ ...c, socials: c.socials.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  const addSocial = () => setC({ ...c, socials: [...c.socials, { label: "", url: "" }] });
  const delSocial = (i: number) => setC({ ...c, socials: c.socials.filter((_, idx) => idx !== i) });

  const save = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      if (!r.ok) throw new Error();
      toast("Контакти збережено", "success");
    } catch {
      toast("Не вдалося зберегти", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHead
        title="Контакти"
        desc="Дані звʼязку та посилання"
        action={
          <ABtn variant="signal" onClick={save} disabled={saving}>
            <IconCheck width={16} height={16} /> {saving ? "Збереження…" : "Зберегти"}
          </ABtn>
        }
      />

      <AdminCard className="grid gap-4 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Discord-запрошення" hint="URL">
            <AInput value={c.discord} onChange={(e) => upd({ discord: e.target.value })} />
          </Field>
          <Field label="Посилання на Roblox" hint="URL">
            <AInput value={c.robloxUrl} onChange={(e) => upd({ robloxUrl: e.target.value })} />
          </Field>
          <Field label="Електронна пошта">
            <AInput value={c.email} onChange={(e) => upd({ email: e.target.value })} />
          </Field>
          <Field label="Час роботи">
            <AInput value={c.hours} onChange={(e) => upd({ hours: e.target.value })} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard className="p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-head text-lg font-semibold text-white">Соціальні мережі</h3>
          <ABtn variant="ghost" onClick={addSocial}>
            <IconPlus width={16} height={16} /> Додати
          </ABtn>
        </div>
        {c.socials.length === 0 ? (
          <EmptyState text="Мереж ще немає" />
        ) : (
          <div className="grid gap-3">
            {c.socials.map((s, i) => (
              <div key={i} className="grid items-end gap-3 sm:grid-cols-[1fr_2fr_auto]">
                <Field label="Назва">
                  <AInput
                    value={s.label}
                    onChange={(e) => updSocial(i, { label: e.target.value })}
                    placeholder="Telegram"
                  />
                </Field>
                <Field label="Посилання">
                  <AInput
                    value={s.url}
                    onChange={(e) => updSocial(i, { url: e.target.value })}
                    placeholder="https://..."
                  />
                </Field>
                <ABtn variant="danger" onClick={() => delSocial(i)}>
                  <IconTrash width={15} height={15} />
                </ABtn>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
