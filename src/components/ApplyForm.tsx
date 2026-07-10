"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "./Toast";
import { IconCheck, IconArrowRight } from "./icons";
import type { ApplicationQuestion } from "@/lib/types";

const emptyId = { firstName: "", lastName: "", discord: "", age: "" };

export function ApplyForm({ questions }: { questions: ApplicationQuestion[] }) {
  const toast = useToast();
  const [id, setId] = useState(emptyId);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const setIdField =
    (k: keyof typeof emptyId) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setId((s) => ({ ...s, [k]: e.target.value }));

  const setAnswer =
    (qid: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setAnswers((s) => ({ ...s, [qid]: e.target.value }));

  async function submit() {
    if (!id.firstName || !id.lastName || !id.discord || !id.age) {
      toast("Заповніть обов'язкові поля", "error");
      return;
    }
    for (const q of questions) {
      if (q.required && !(answers[q.id] || "").trim()) {
        toast(`Заповніть: ${q.label}`, "error");
        return;
      }
    }
    setLoading(true);
    try {
      const payload = {
        ...id,
        answers: questions.map((q) => ({
          questionId: q.id,
          label: q.label,
          value: answers[q.id] || "",
        })),
      };
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setDone(true);
      setId(emptyId);
      setAnswers({});
    } catch {
      toast("Не вдалося надіслати. Спробуйте ще раз", "error");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <motion.div
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
          <Link href="/" className="btn-ghost">
            На головну
          </Link>
          <button onClick={() => setDone(false)} className="btn-primary">
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Ім'я *</label>
          <input className="field" value={id.firstName} onChange={setIdField("firstName")} placeholder="Олександр" />
        </div>
        <div>
          <label className="field-label">Прізвище *</label>
          <input className="field" value={id.lastName} onChange={setIdField("lastName")} placeholder="Ткаченко" />
        </div>
        <div>
          <label className="field-label">Discord *</label>
          <input className="field" value={id.discord} onChange={setIdField("discord")} placeholder="username" />
        </div>
        <div>
          <label className="field-label">Вік *</label>
          <input className="field" value={id.age} onChange={setIdField("age")} placeholder="18" inputMode="numeric" />
        </div>
      </div>

      {questions.length > 0 && (
        <div className="mt-4 grid gap-4">
          {questions.map((q) => (
            <div key={q.id} className={q.type === "short" ? "" : ""}>
              <label className="field-label">
                {q.label} {q.required && "*"}
              </label>
              {q.type === "long" ? (
                <textarea
                  className="field min-h-[90px] resize-y"
                  value={answers[q.id] || ""}
                  onChange={setAnswer(q.id)}
                />
              ) : (
                <input
                  className="field"
                  value={answers[q.id] || ""}
                  onChange={setAnswer(q.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}

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
  );
}
