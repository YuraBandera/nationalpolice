"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useToast } from "@/components/Toast";
import { IconCheck, IconArrowRight, IconCar } from "@/components/icons";
import { KUPAP_ARTICLES, kupapPunishment } from "@/lib/kupapArticles";

const empty = { offender: "", vehicle: "", article: "", place: "", when: "", circumstances: "", evidence: "" };

export function AdminOffenseForm({ lockedApplicant }: { lockedApplicant?: string }) {
  const toast = useToast();
  const [f, setF] = useState(empty);
  const [website, setWebsite] = useState("");
  const openedAt = useRef<number>(Date.now());
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit() {
    if (!lockedApplicant) {
      toast("Спершу увійдіть до реєстру за своїм ніком", "error");
      return;
    }
    if (!f.offender || !f.vehicle || !f.article || !f.evidence) {
      toast("Заповніть обов'язкові поля: нік порушника, номер ТЗ, стаття, доказ", "error");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/admin-offense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, applicant: lockedApplicant, website, _t: openedAt.current }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        toast(d.error || "Не вдалося подати заяву", "error");
        return;
      }
      setDone(true);
      setF(empty);
    } catch {
      toast("Не вдалося подати заяву", "error");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-good/30 bg-white p-10 text-center shadow-card">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-good/12 text-good">
          <IconCheck width={32} height={32} />
        </div>
        <h2 className="font-head text-2xl font-bold text-navy-900">Заяву передано</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-navy-800/65">
          Ваша заява про адміністративне правопорушення надіслана до чергової частини. Її розглянуть
          відповідальні працівники.
        </p>
        <button onClick={() => setDone(false)} className="btn-primary mt-7">Подати ще одну</button>
      </motion.div>
    );
  }

  const selected = KUPAP_ARTICLES.find((a) => a.code === f.article);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-card sm:p-8">
      <input
        type="text" name="website" tabIndex={-1} autoComplete="off" value={website}
        onChange={(e) => setWebsite(e.target.value)} aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      <div className="mb-5 flex items-center gap-2 rounded-xl bg-signal/8 px-4 py-3 text-[13.5px] text-navy-800/75">
        <IconCar width={18} height={18} className="shrink-0 text-navy-700" />
        Для порушень ПДР обов'язково вкажіть <b className="mx-1">номер ТЗ</b> та додайте доказ (посилання
        на скріншот або відео).
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Ваш нік у Roblox</label>
          <input className="field bg-navy-900/5 text-navy-800/70" value={lockedApplicant || ""} disabled />
        </div>
        <div>
          <label className="field-label">Нік порушника (Roblox) *</label>
          <input className="field" value={f.offender} onChange={set("offender")} placeholder="Roblox-нік порушника" />
        </div>
        <div>
          <label className="field-label">Номер ТЗ *</label>
          <input className="field font-mono uppercase" value={f.vehicle} onChange={set("vehicle")} placeholder="AA0000AA" />
        </div>
        <div>
          <label className="field-label">Стаття КУпАП *</label>
          <select className="field" value={f.article} onChange={set("article")}>
            <option value="">Оберіть статтю…</option>
            {KUPAP_ARTICLES.map((a) => (
              <option key={a.code} value={a.code}>ст. {a.code} — {a.title}</option>
            ))}
          </select>
          {selected && <p className="mt-1 text-[12px] text-navy-800/55">Санкція: {kupapPunishment(selected.code)}</p>}
        </div>
        <div>
          <label className="field-label">Місце</label>
          <input className="field" value={f.place} onChange={set("place")} placeholder="Вулиця / район" />
        </div>
        <div>
          <label className="field-label">Дата й час</label>
          <input className="field" value={f.when} onChange={set("when")} placeholder="20.07.2026, 14:30" />
        </div>
      </div>

      <div className="mt-4">
        <label className="field-label">Обставини</label>
        <textarea className="field min-h-[100px] resize-y" value={f.circumstances} onChange={set("circumstances")} placeholder="Опишіть, що саме сталося…" />
      </div>

      <div className="mt-4">
        <label className="field-label">Доказ *</label>
        <input className="field" value={f.evidence} onChange={set("evidence")} placeholder="Посилання на скріншот / відео (обов'язково)" />
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <p className="text-[12.5px] text-navy-800/50">Поля з «*» — обов'язкові</p>
        <button onClick={submit} disabled={loading} className="btn-signal px-6 py-3.5 disabled:opacity-60">
          {loading ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-950/30 border-t-navy-950" /> Надсилаємо…</>
          ) : (
            <>Подати заяву <IconArrowRight width={17} height={17} /></>
          )}
        </button>
      </div>
    </motion.div>
  );
}
