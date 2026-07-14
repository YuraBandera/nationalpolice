"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { useToast } from "./Toast";
import { IconCheck, IconArrowRight } from "./icons";
import { UNITS } from "@/lib/site";

const empty = { discord: "", nickname: "", robloxSelf: "", robloxTarget: "", against: "", unit: "", date: "", description: "", evidence: "" };

export function ComplaintForm() {
  const toast = useToast();
  const [f, setF] = useState(empty);
  const [website, setWebsite] = useState(""); // honeypot — має лишатись порожнім
  const openedAt = useRef<number>(Date.now());
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit() {
    if (!f.discord || !f.robloxSelf || !f.robloxTarget || !f.description) {
      toast("Заповніть обов'язкові поля", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, website, _t: openedAt.current }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        toast(d.error || "Не вдалося подати скаргу. Спробуйте ще раз", "error");
        return;
      }
      setDone(true);
      setF(empty);
    } catch {
      toast("Не вдалося подати скаргу. Спробуйте ще раз", "error");
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
          <h2 className="font-head text-2xl font-bold text-navy-900">Скаргу подано</h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-navy-800/65">
            Вашу скаргу зареєстровано. Адміністрація розгляне звернення найближчим часом. За потреби з
            вами зв'яжуться у Discord.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link href="/" className="btn-ghost">На головну</Link>
            <button onClick={() => setDone(false)} className="btn-primary">Подати ще одну</button>
          </div>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-card sm:p-8">
          {/* honeypot: приховане поле для ботів. Люди його не бачать і не заповнюють. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Ваш Discord *</label>
              <input className="field" value={f.discord} onChange={set("discord")} placeholder="username" />
            </div>
            <div>
              <label className="field-label">Ваш нік у Roblox *</label>
              <input className="field" value={f.robloxSelf} onChange={set("robloxSelf")} placeholder="Ваш Roblox-нікнейм" />
            </div>
            <div>
              <label className="field-label">Roblox-нік порушника *</label>
              <input className="field" value={f.robloxTarget} onChange={set("robloxTarget")} placeholder="Roblox-нік того, на кого скарга" />
            </div>
            <div>
              <label className="field-label">Discord порушника</label>
              <input className="field" value={f.against} onChange={set("against")} placeholder="Якщо відомо" />
            </div>
            <div>
              <label className="field-label">Підрозділ</label>
              <select className="field" value={f.unit} onChange={set("unit")}>
                <option value="">Не вказано</option>
                {UNITS.map((u) => (
                  <option key={u.slug} value={u.name}>{u.name}</option>
                ))}
                <option value="Інше">Інше</option>
              </select>
            </div>
            <div>
              <label className="field-label">Дата ситуації</label>
              <input className="field" type="date" value={f.date} onChange={set("date")} />
            </div>
          </div>

          <div className="mt-4 grid gap-4">
            <div>
              <label className="field-label">Опис ситуації *</label>
              <textarea className="field min-h-[140px] resize-y" value={f.description} onChange={set("description")} placeholder="Детально опишіть, що сталося" />
            </div>
            <div>
              <label className="field-label">Посилання на докази</label>
              <input className="field" value={f.evidence} onChange={set("evidence")} placeholder="Скріншоти, відео, кліпи" />
            </div>
          </div>

          <div className="mt-7 flex items-center justify-between gap-4">
            <p className="text-[12.5px] text-navy-800/50">Поля з «*» — обов'язкові</p>
            <button onClick={submit} disabled={loading} className="btn-primary px-6 py-3.5 disabled:opacity-60">
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Надсилаємо…
                </>
              ) : (
                <>
                  Подати скаргу <IconArrowRight width={17} height={17} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
