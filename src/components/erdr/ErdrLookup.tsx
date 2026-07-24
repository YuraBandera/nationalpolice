"use client";

import { useState } from "react";
import { statusLabel, statusColor } from "@/lib/kkArticles";

interface PublicCase {
  found: boolean;
  number?: string;
  articles?: { code: string; title: string }[];
  status?: string;
  fabula?: string;
  applicant?: string;
  suspect?: string;
  createdAt?: string;
  updatedAt?: string;
}

function fmt(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("uk-UA", { day: "2-digit", month: "long", year: "numeric" });
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

      {result && !result.found && (
        <div className="mt-6 rounded-xl border border-navy-900/8 bg-ice px-5 py-6 text-center text-navy-800/70">
          Провадження з таким номером не знайдено. Перевірте правильність номера.
        </div>
      )}

      {result && result.found && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-900/8 pb-4">
            <span className="font-mono text-lg font-semibold text-navy-900">{result.number}</span>
            <span
              className="rounded-full px-3 py-1 text-sm font-semibold text-white"
              style={{ background: statusColor(result.status || "") }}
            >
              {statusLabel(result.status || "")}
            </span>
          </div>

          {result.articles && result.articles.length > 0 && (
            <div>
              <p className="field-label">Кваліфікація</p>
              <div className="flex flex-wrap gap-2">
                {result.articles.map((a) => (
                  <span key={a.code} className="rounded-lg bg-navy-900/6 px-3 py-1.5 text-sm text-navy-800">
                    <span className="font-mono font-semibold">ст. {a.code}</span>
                    {a.title ? ` — ${a.title}` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.fabula && (
            <div>
              <p className="field-label">Фабула</p>
              <p className="text-[15px] leading-relaxed text-navy-800/80">{result.fabula}</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="field-label">Заявник (Roblox)</p>
              <p className="text-[15px] text-navy-900">{result.applicant || "—"}</p>
            </div>
            <div>
              <p className="field-label">Фігурант (Roblox)</p>
              <p className="text-[15px] text-navy-900">{result.suspect || "—"}</p>
            </div>
            <div>
              <p className="field-label">Зареєстровано</p>
              <p className="text-[15px] text-navy-900">{fmt(result.createdAt)}</p>
            </div>
            <div>
              <p className="field-label">Оновлено</p>
              <p className="text-[15px] text-navy-900">{fmt(result.updatedAt)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
