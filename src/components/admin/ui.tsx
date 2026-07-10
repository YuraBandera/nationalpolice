"use client";

import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function AdminCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-navy-900/40 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

export function SectionHead({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-head text-xl font-semibold text-white sm:text-2xl">{title}</h2>
        {desc && <p className="mt-1 text-sm text-ice/55">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ice/60">
        {label}
        {hint && <span className="font-normal normal-case tracking-normal text-ice/35">· {hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function AInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-white/12 bg-navy-950/60 px-4 py-2.5 text-[15px] text-white placeholder:text-ice/30 transition focus:border-navy-400 focus:outline-none focus:ring-4 focus:ring-navy-400/15 ${props.className || ""}`}
    />
  );
}

export function ATextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-white/12 bg-navy-950/60 px-4 py-2.5 text-[15px] leading-relaxed text-white placeholder:text-ice/30 transition focus:border-navy-400 focus:outline-none focus:ring-4 focus:ring-navy-400/15 ${props.className || ""}`}
    />
  );
}

export function ABtn({
  children,
  variant = "primary",
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger" | "signal";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles: Record<string, string> = {
    primary: "bg-navy-500 text-white hover:bg-navy-400",
    ghost: "border border-white/15 bg-white/5 text-ice/80 hover:bg-white/10 hover:text-white",
    danger: "border border-bad/40 bg-bad/10 text-bad hover:bg-bad/20",
    signal: "bg-signal text-navy-950 hover:brightness-105",
  };
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

const statusMap: Record<string, { label: string; cls: string }> = {
  new: { label: "Нова", cls: "bg-navy-400/20 text-navy-300 border-navy-400/30" },
  reviewed: { label: "Розглянуто", cls: "bg-signal/15 text-signal border-signal/30" },
  accepted: { label: "Прийнято", cls: "bg-good/15 text-good border-good/30" },
  rejected: { label: "Відхилено", cls: "bg-bad/15 text-bad border-bad/30" },
  resolved: { label: "Вирішено", cls: "bg-good/15 text-good border-good/30" },
};

export function StatusTag({ status }: { status: string }) {
  const s = statusMap[status] || statusMap.new;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${s.cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/12 px-6 py-12 text-center text-sm text-ice/45">
      {text}
    </div>
  );
}
