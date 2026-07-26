"use client";

import { useState } from "react";
import { statusLabel, statusColor } from "@/lib/kkArticles";

interface PublicCase {
  found: boolean;
  number?: string;
  articles?: { code: string; title: string; punishment: string }[];
  status?: string;
  fabula?: string;
  applicant?: string;
  suspect?: string;
  signature?: string;
  applicantSignature?: string;
  source?: string;
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
        <div className="mt-5 overflow-hidden rounded-2xl border border-navy-900/12 bg-white shadow-card">
          {/* шапка документа */}
          <div className="border-b-2 border-navy-900/10 bg-navy-950 px-6 py-4 text-white sm:px-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal">
              Витяг з Єдиного реєстру досудових розслідувань
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-lg font-semibold">{result.number}</span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: statusColor(result.status || "") }}
              >
                {statusLabel(result.status || "")}
              </span>
            </div>
          </div>

          <div className="space-y-5 px-6 py-6 sm:px-8">
            {result.articles && result.articles.length > 0 && (
              <div>
                <p className="field-label">Правова кваліфікація</p>
                <div className="space-y-1.5">
                  {result.articles.map((a) => (
                    <div key={a.code} className="rounded-lg border border-navy-900/8 bg-navy-900/[0.02] px-3 py-2">
                      <p className="text-sm text-navy-900">
                        <span className="font-mono font-semibold">ст. {a.code}</span>
                        {a.title ? ` — ${a.title}` : ""}
                      </p>
                      {a.punishment && (
                        <p className="mt-0.5 text-[12.5px] text-navy-800/60">Санкція: {a.punishment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.fabula && (
              <div>
                <p className="field-label">Фабула</p>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-navy-800/80">{result.fabula}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Заявник (Roblox)" value={result.applicant} />
              <Info label="Фігурант (Roblox)" value={result.suspect} />
              <Info label="Зареєстровано" value={fmt(result.createdAt)} />
              <Info label="Оновлено" value={fmt(result.updatedAt)} />
            </div>

            {/* підписи */}
            {(result.applicantSignature || result.signature) && (
              <div className="grid gap-6 border-t border-navy-900/8 pt-5 sm:grid-cols-2">
                {result.applicantSignature && <SignBlock label="Підпис заявника" src={result.applicantSignature} />}
                {result.signature && <SignBlock label="Підпис слідчого" src={result.signature} />}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="field-label">{label}</p>
      <p className="text-[15px] text-navy-900">{value || "—"}</p>
    </div>
  );
}

function SignBlock({ label, src }: { label: string; src: string }) {
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} className="h-16 w-full max-w-[220px] rounded bg-white object-contain" />
      <div className="mt-1 border-t border-navy-900/20 pt-1 text-[12px] text-navy-800/55">{label}</div>
    </div>
  );
}
