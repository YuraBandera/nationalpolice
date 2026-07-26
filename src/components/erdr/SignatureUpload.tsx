"use client";

import { useRef, useState } from "react";
import { useToast } from "@/components/Toast";

/** Завантаження зображення-підпису. Світла й темна теми через prop `dark`. */
export function SignatureUpload({
  value,
  onChange,
  dark = false,
}: {
  value?: string;
  onChange: (url: string) => void;
  dark?: boolean;
}) {
  const toast = useToast();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/erdr/upload", { method: "POST", body: fd });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        toast(d.error || "Не вдалося завантажити підпис", "error");
        return;
      }
      onChange(d.url);
      toast("Підпис додано", "success");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  const border = dark ? "border-white/15" : "border-navy-900/15";
  const bg = dark ? "bg-white/5 text-ice/80 hover:bg-white/10" : "bg-navy-900/[0.03] text-navy-700 hover:bg-navy-900/[0.06]";

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <div className={`flex items-center gap-3 rounded-xl border ${border} p-2`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Підпис" className="h-12 w-28 rounded bg-white object-contain" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-semibold text-bad hover:underline"
          >
            Прибрати
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className={`inline-flex items-center gap-2 rounded-xl border ${border} ${bg} px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50`}
        >
          {busy ? "Завантаження…" : "Вкласти підпис (PNG)"}
        </button>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />
    </div>
  );
}
