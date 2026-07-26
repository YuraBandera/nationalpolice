"use client";

import { useState } from "react";
import { KK_ARTICLES } from "@/lib/kkArticles";

export function ArticlePicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [q, setQ] = useState("");
  const toggle = (code: string) =>
    onChange(value.includes(code) ? value.filter((c) => c !== code) : [...value, code]);
  const filtered = KK_ARTICLES.filter(
    (a) => a.code.includes(q) || a.title.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div>
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((c) => (
            <button
              key={c}
              onClick={() => toggle(c)}
              className="rounded-lg bg-signal/15 px-2 py-1 text-xs font-semibold text-signal"
            >
              ст. {c} ✕
            </button>
          ))}
        </div>
      )}
      <input
        className="mb-2 w-full rounded-lg border border-white/12 bg-navy-950/60 px-3 py-2 text-sm text-white focus:border-navy-400 focus:outline-none"
        placeholder="Пошук статті…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="max-h-44 space-y-1 overflow-y-auto rounded-lg border border-white/8 p-1">
        {filtered.map((a) => (
          <button
            key={a.code}
            onClick={() => toggle(a.code)}
            className={`block w-full rounded px-2 py-1.5 text-left text-[13px] transition ${
              value.includes(a.code) ? "bg-signal/15 text-signal" : "text-ice/70 hover:bg-white/5"
            }`}
          >
            <span className="font-mono font-semibold">ст. {a.code}</span> — {a.title}
          </button>
        ))}
      </div>
    </div>
  );
}
