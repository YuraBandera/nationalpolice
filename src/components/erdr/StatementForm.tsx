"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { useToast } from "@/components/Toast";
import { IconCheck, IconArrowRight } from "@/components/icons";

const empty = { applicant: "", suspect: "", fabula: "" };

export function StatementForm({ lockedApplicant }: { lockedApplicant?: string }) {
  const toast = useToast();
  const [f, setF] = useState({ ...empty, applicant: lockedApplicant || "" });
  const [website, setWebsite] = useState("");
  const openedAt = useRef<number>(Date.now());
  const [loading, setLoading] = useState(false);
  const [doneNumber, setDoneNumber] = useState<string | null>(null);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit() {
    if (!f.applicant || !f.fabula) {
      toast("Заповніть обов'язкові поля", "error");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/erdr/statement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, website, _t: openedAt.current }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        toast(d.error || "Не вдалося подати заяву", "error");
        return;
      }
      setDoneNumber(d.number || "");
      setF({ ...empty, applicant: lockedApplicant || "" });
    } catch {
      toast("Не вдалося подати заяву", "error");
    } finally {
      setLoading(false);
    }
  }

  if (doneNumber !== null) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-good/30 bg-white p-10 text-center shadow-card"
      >
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-good/12 text-good">
          <IconCheck width={32} height={32} />
        </div>
        <h2 className="font-head text-2xl font-bold text-navy-900">Заяву зареєстровано</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-navy-800/65">
          Ваша заява внесена до реєстру. Збережіть номер провадження — за ним ви зможете відстежувати
          статус розгляду.
        </p>
        {doneNumber && (
          <p className="mx-auto mt-4 inline-block rounded-xl bg-navy-900/6 px-5 py-3 font-mono text-lg font-semibold text-navy-900">
            {doneNumber}
          </p>
        )}
        <div className="mt-7 flex justify-center gap-3">
          <Link href="/erdr" className="btn-ghost">
            До реєстру
          </Link>
          <button onClick={() => setDoneNumber(null)} className="btn-primary">
            Подати ще одну
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-card sm:p-8"
    >
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
          <label className="field-label">Ваш нік у Roblox *</label>
          <input
            className="field disabled:bg-navy-900/5 disabled:text-navy-800/60"
            value={f.applicant}
            onChange={set("applicant")}
            placeholder="Ваш Roblox-нікнейм"
            disabled={!!lockedApplicant}
          />
        </div>
        <div>
          <label className="field-label">Roblox-нік підозрюваного</label>
          <input className="field" value={f.suspect} onChange={set("suspect")} placeholder="Якщо відомо" />
        </div>
      </div>
      <div className="mt-4">
        <label className="field-label">Опис події *</label>
        <textarea
          className="field min-h-[130px] resize-y"
          value={f.fabula}
          onChange={set("fabula")}
          placeholder="Що сталося, коли, за яких обставин, хто свідки…"
        />
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
              Подати заяву <IconArrowRight width={17} height={17} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
