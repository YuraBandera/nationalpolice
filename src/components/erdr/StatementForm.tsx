"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { useToast } from "@/components/Toast";
import { IconCheck, IconArrowRight } from "@/components/icons";
import { SignatureUpload } from "./SignatureUpload";
import { StatementDocument } from "./StatementDocument";

const DEFAULT_COURT = "Головного слідчого управління ГУНП у м. Києві";

const empty = {
  fullName: "",
  court: DEFAULT_COURT,
  suspect: "",
  eventDate: "",
  eventPlace: "",
  fabula: "",
  witnesses: "",
  evidence: "",
};

export function StatementForm({ lockedApplicant }: { lockedApplicant?: string }) {
  const toast = useToast();
  const [f, setF] = useState(empty);
  const [signature, setSignature] = useState("");
  const [website, setWebsite] = useState("");
  const [preview, setPreview] = useState(false);
  const openedAt = useRef<number>(Date.now());
  const [loading, setLoading] = useState(false);
  const [doneNumber, setDoneNumber] = useState<string | null>(null);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit() {
    if (!lockedApplicant) {
      toast("Спершу увійдіть до реєстру за своїм ніком", "error");
      return;
    }
    if (!f.fullName.trim() || !f.fabula.trim()) {
      toast("Заповніть обов'язкові поля (ПІБ та обставини)", "error");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/erdr/statement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...f,
          applicant: lockedApplicant,
          applicantSignature: signature,
          website,
          _t: openedAt.current,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        toast(d.error || "Не вдалося подати заяву", "error");
        return;
      }
      setDoneNumber(d.number || "");
      setF(empty);
      setSignature("");
    } catch {
      toast("Не вдалося подати заяву", "error");
    } finally {
      setLoading(false);
    }
  }

  if (doneNumber !== null) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-good/30 bg-white p-10 text-center shadow-card">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-good/12 text-good">
          <IconCheck width={32} height={32} />
        </div>
        <h2 className="font-head text-2xl font-bold text-navy-900">Заяву зареєстровано</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-navy-800/65">
          Ваша заява внесена до реєстру. Збережіть номер провадження — за ним ви зможете відстежувати
          статус розгляду та переглянути документ.
        </p>
        {doneNumber && (
          <p className="mx-auto mt-4 inline-block rounded-xl bg-navy-900/6 px-5 py-3 font-mono text-lg font-semibold text-navy-900">{doneNumber}</p>
        )}
        <div className="mt-7 flex justify-center gap-3">
          <Link href="/erdr" className="btn-ghost">До реєстру</Link>
          <button onClick={() => setDoneNumber(null)} className="btn-primary">Подати ще одну</button>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-card sm:p-8">
        <input
          type="text" name="website" tabIndex={-1} autoComplete="off" value={website}
          onChange={(e) => setWebsite(e.target.value)} aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Ваш нік у Roblox</label>
            <input className="field bg-navy-900/5 text-navy-800/70" value={lockedApplicant || ""} disabled />
          </div>
          <div>
            <label className="field-label">ПІБ заявника *</label>
            <input className="field" value={f.fullName} onChange={set("fullName")} placeholder="Заболотний Даниїл Максимович" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Кому подається</label>
            <input className="field" value={f.court} onChange={set("court")} />
          </div>
          <div>
            <label className="field-label">Дата й час події</label>
            <input className="field" value={f.eventDate} onChange={set("eventDate")} placeholder="20.07.2026 приблизно о 14:30" />
          </div>
          <div>
            <label className="field-label">Місце події</label>
            <input className="field" value={f.eventPlace} onChange={set("eventPlace")} placeholder="Алея Небесної Сотні" />
          </div>
          <div>
            <label className="field-label">Roblox-нік підозрюваного</label>
            <input className="field" value={f.suspect} onChange={set("suspect")} placeholder="Якщо відомо" />
          </div>
          <div>
            <label className="field-label">Свідки</label>
            <input className="field" value={f.witnesses} onChange={set("witnesses")} placeholder="Ніки свідків через кому" />
          </div>
        </div>

        <div className="mt-4">
          <label className="field-label">Обставини події *</label>
          <textarea className="field min-h-[130px] resize-y" value={f.fabula} onChange={set("fabula")} placeholder="Детально опишіть, що сталося…" />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Докази</label>
            <input className="field" value={f.evidence} onChange={set("evidence")} placeholder="Посилання або опис" />
          </div>
          <div>
            <label className="field-label">Ваш підпис</label>
            <SignatureUpload value={signature} onChange={setSignature} />
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <button onClick={() => setPreview((v) => !v)} className="text-sm font-semibold text-navy-700 underline">
            {preview ? "Сховати документ" : "Переглянути як документ"}
          </button>
          <button onClick={submit} disabled={loading} className="btn-signal px-6 py-3.5 disabled:opacity-60">
            {loading ? (
              <><span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-950/30 border-t-navy-950" /> Надсилаємо…</>
            ) : (
              <>Подати заяву <IconArrowRight width={17} height={17} /></>
            )}
          </button>
        </div>
      </motion.div>

      {preview && (
        <div className="mt-6">
          <p className="mb-2 text-center text-[12px] uppercase tracking-[0.2em] text-navy-800/40">Попередній перегляд документа</p>
          <StatementDocument
            court={f.court}
            applicant={lockedApplicant}
            fullName={f.fullName}
            suspect={f.suspect}
            eventDate={f.eventDate}
            eventPlace={f.eventPlace}
            fabula={f.fabula}
            witnesses={f.witnesses}
            evidence={f.evidence}
            applicantSignature={signature}
            createdAt={new Date().toISOString()}
          />
        </div>
      )}
    </div>
  );
}
