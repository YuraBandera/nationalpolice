"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "./Toast";
import { IconCheck, IconArrowRight } from "./icons";

const empty = {
  firstName: "", lastName: "", discord: "", age: "", steam: "", timezone: "",
  rpExperience: "", whyJoin: "", whyGunp: "", punishments: "", extra: "",
};

export function ApplyForm() {
  const toast = useToast();
  const [f, setF] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit() {
    if (!f.firstName || !f.lastName || !f.discord || !f.age || !f.whyJoin) {
      toast("Заповніть обов'язкові поля", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      if (!res.ok) throw new Error();
      setDone(true);
      setF(empty);
    } catch {
      toast("Не вдалося надіслати. Спробуйте ще раз", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-good/30 bg-white p-10 text-center shadow-card"
        >
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-good/12 text-good">
            <IconCheck width={32} height={32} />
          </div>
          <h2 className="font-head text-2xl font-bold text-navy-900">Заявку надіслано</h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-navy-800/65">
            Дякуємо! Ваша заявка збережена та передана відділу кадрів. Слідкуйте за особистими
            повідомленнями у Discord — з вами зв'яжуться після розгляду.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link href="/" className="btn-ghost">На головну</Link>
            <button onClick={() => setDone(false)} className="btn-primary">Подати ще одну</button>
          </div>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-card sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Ім'я *</label>
              <input className="field" value={f.firstName} onChange={set("firstName")} placeholder="Олександр" />
            </div>
            <div>
              <label className="field-label">Прізвище *</label>
              <input className="field" value={f.lastName} onChange={set("lastName")} placeholder="Ткаченко" />
            </div>
            <div>
              <label className="field-label">Discord *</label>
              <input className="field" value={f.discord} onChange={set("discord")} placeholder="username" />
            </div>
            <div>
              <label className="field-label">Вік *</label>
              <input className="field" value={f.age} onChange={set("age")} placeholder="18" inputMode="numeric" />
            </div>
            <div>
              <label className="field-label">Steam</label>
              <input className="field" value={f.steam} onChange={set("steam")} placeholder="Посилання на профіль" />
            </div>
            <div>
              <label className="field-label">Часовий пояс</label>
              <input className="field" value={f.timezone} onChange={set("timezone")} placeholder="GMT+2 (Київ)" />
            </div>
          </div>

          <div className="mt-4 grid gap-4">
            <div>
              <label className="field-label">Досвід RolePlay</label>
              <textarea className="field min-h-[90px] resize-y" value={f.rpExperience} onChange={set("rpExperience")} placeholder="Опишіть, де і скільки ви граєте в RP" />
            </div>
            <div>
              <label className="field-label">Чому хочете вступити? *</label>
              <textarea className="field min-h-[90px] resize-y" value={f.whyJoin} onChange={set("whyJoin")} placeholder="Що вас мотивує" />
            </div>
            <div>
              <label className="field-label">Чому саме ГУНП?</label>
              <textarea className="field min-h-[90px] resize-y" value={f.whyGunp} onChange={set("whyGunp")} placeholder="Чому обрали наше управління" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Чи були покарання?</label>
                <input className="field" value={f.punishments} onChange={set("punishments")} placeholder="Так / Ні, деталі" />
              </div>
              <div>
                <label className="field-label">Додаткова інформація</label>
                <input className="field" value={f.extra} onChange={set("extra")} placeholder="Що ще варто знати" />
              </div>
            </div>
          </div>

          <div className="mt-7 flex items-center justify-between gap-4">
            <p className="text-[12.5px] text-navy-800/50">Поля з «*» — обов'язкові</p>
            <button onClick={submit} disabled={loading} className="btn-signal px-6 py-3.5 disabled:opacity-60">
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-950/30 border-t-navy-950" />
                  Надсилаємо…
                </>
              ) : (
                <>
                  Надіслати заявку <IconArrowRight width={17} height={17} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
