"use client";

import { useRef, useState } from "react";
import { useToast } from "@/components/Toast";
import { IconImage, IconTrash } from "@/components/icons";
import { AInput, Field } from "./ui";

export function ImageField({
  label,
  value,
  onChange,
  accept = "image/*",
  hint = "файл або посилання",
  isVideo = false,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  hint?: string;
  isVideo?: boolean;
}) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        toast(d.error || "Не вдалося завантажити", "error");
        return;
      }
      onChange(d.url);
      toast("Файл завантажено", "success");
    } catch {
      toast("Помилка завантаження", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-col gap-2.5">
        <div className="flex gap-2">
          <AInput
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://…  або завантаж файл →"
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-ice/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            {uploading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-signal" />
            ) : (
              <IconImage width={16} height={16} />
            )}
            {uploading ? "Завантаження…" : "Файл"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
          />
        </div>

        {value && (
          <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-navy-950/50 p-2.5">
            {isVideo ? (
              <video src={value} className="h-14 w-20 rounded-lg object-cover" muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="Прев'ю"
                className="h-14 w-20 rounded-lg object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0.2";
                }}
              />
            )}
            <span className="flex-1 truncate text-xs text-ice/50">{value}</span>
            <button
              type="button"
              onClick={() => onChange("")}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-bad/30 text-bad transition hover:bg-bad/15"
              aria-label="Прибрати"
            >
              <IconTrash width={14} height={14} />
            </button>
          </div>
        )}
      </div>
    </Field>
  );
}
