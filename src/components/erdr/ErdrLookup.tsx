"use client";

import { useState } from "react";
import { statusLabel, statusColor } from "@/lib/kkArticles";
import { StatementDocument } from "./StatementDocument";

interface PublicCase {
  found: boolean;
  number?: string;
  articles?: { code: string; title: string; punishment?: string }[];
  status?: string;
  fabula?: string;
  applicant?: string;
  suspect?: string;
  fullName?: string;
  court?: string;
  eventDate?: string;
  eventPlace?: string;
  witnesses?: string;
  evidence?: string;
  signature?: string;
  applicantSignature?: string;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function ErdrLookup() {
  const [num, setNum] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PublicCase | null>(null);

  async function search() {
    const q = num.replace(/\s+/g, "");
    if (!q) return;
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch(`/api/erdr/lookup?number=${encodeURIComponent(q)}`, { cache: "no-store" });
      setResult(await r.json());
    } catch {
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-card sm:p-8">
        <label className="field-label">Номер провадження</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="field flex-1 font-mono"
            value={num}
            onChange={(e) => setNum(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Напр. 126202600000001"
            inputMode="numeric"
          />
          <button onClick={search} disabled={loading} className="btn-primary px-6 py-3.5 disabled:opacity-60">
            {loading ? "Пошук…" : "Знайти"}
          </button>
        </div>
      </div>

      {result && !result.found && (
        <div className="mt-5 rounded-2xl border border-navy-900/8 bg-white px-5 py-8 text-center text-navy-800/70 shadow-card">
          Провадження з таким номером не знайдено. Перевірте правильність номера.
        </div>
      )}

      {result && result.found && (
        <div className="mt-6">
          {/* статус-стрічка */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-sm font-semibold text-navy-900">{result.number}</span>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ background: statusColor(result.status || "") }}
            >
              {statusLabel(result.status || "")}
            </span>
          </div>

          <StatementDocument official {...result} />

          {result.articles && result.articles.length > 0 && (
            <div className="mx-auto mt-4 max-w-[820px] rounded-xl border border-navy-900/8 bg-white p-5 shadow-card">
              <p className="field-label">Правова кваліфікація</p>
              <div className="space-y-1.5">
                {result.articles.map((a) => (
                  <div key={a.code} className="rounded-lg border border-navy-900/8 bg-navy-900/[0.02] px-3 py-2">
                    <p className="text-sm text-navy-900">
                      <span className="font-mono font-semibold">ст. {a.code}</span>
                      {a.title ? ` — ${a.title}` : ""}
                    </p>
                    {a.punishment && <p className="mt-0.5 text-[12.5px] text-navy-800/60">Санкція: {a.punishment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
