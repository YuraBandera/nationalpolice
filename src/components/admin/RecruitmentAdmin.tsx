"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { IconCheck, IconFile, IconLock } from "@/components/icons";
import { AdminCard, SectionHead, Field, AInput, ATextarea, ABtn, EmptyState } from "./ui";
import type { SiteSettings } from "@/lib/types";

export function RecruitmentAdmin() {
  const toast = useToast();
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/settings", { cache: "no-store" });
      setS(await r.json());
    })();
  }, []);

  if (!s) {
    return (
      <div className="space-y-6">
        <SectionHead title="Набір" desc="Керування прийомом заявок" />
        <EmptyState text="Завантаження…" />
      </div>
    );
  }

  const save = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      if (!r.ok) throw new Error();
      toast("Налаштування набору збережено", "success");
    } catch {
      toast("Не вдалося зберегти", "error");
    } finally {
      setSaving(false);
    }
  };

  const open = s.recruitmentOpen;

  return (
    <div className="space-y-6">
      <SectionHead
        title="Набір"
        desc="Керування прийомом заявок на вступ"
        action={
          <ABtn variant="signal" onClick={save} disabled={saving}>
            <IconCheck width={16} height={16} /> {saving ? "Збереження…" : "Зберегти"}
          </ABtn>
        }
      />

      <AdminCard className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`grid h-11 w-11 place-items-center rounded-xl ${
                open ? "bg-good/15 text-good" : "bg-bad/12 text-bad"
              }`}
            >
              {open ? <IconFile width={20} height={20} /> : <IconLock width={20} height={20} />}
            </span>
            <div>
              <p className="font-head text-lg font-semibold text-white">
                Набір {open ? "відкрито" : "закрито"}
              </p>
              <p className="text-sm text-ice/55">
                {open
                  ? "Відвідувачі можуть подати заявку на сторінці «Подати заявку»."
                  : "Замість форми показується повідомлення нижче."}
              </p>
            </div>
          </div>

          <button
            onClick={() => setS({ ...s, recruitmentOpen: !open })}
            role="switch"
            aria-checked={open}
            className={`relative h-8 w-14 shrink-0 rounded-full border transition ${
              open ? "border-good/40 bg-good/25" : "border-white/15 bg-navy-950/70"
            }`}
          >
            <span
              className={`absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white shadow transition-all ${
                open ? "left-[26px]" : "left-1"
              }`}
            />
          </button>
        </div>
      </AdminCard>

      <AdminCard className="grid gap-4 p-5 sm:p-6">
        <p className="text-sm text-ice/55">
          Ці тексти показуються на сторінці заявки, коли набір закрито.
        </p>
        <Field label="Заголовок повідомлення">
          <AInput
            value={s.recruitmentClosedTitle}
            onChange={(e) => setS({ ...s, recruitmentClosedTitle: e.target.value })}
          />
        </Field>
        <Field label="Текст повідомлення">
          <ATextarea
            rows={4}
            value={s.recruitmentClosedMessage}
            onChange={(e) => setS({ ...s, recruitmentClosedMessage: e.target.value })}
          />
        </Field>
      </AdminCard>
    </div>
  );
}
