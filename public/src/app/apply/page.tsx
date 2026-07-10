import type { Metadata } from "next";
import Link from "next/link";
import { ApplyForm } from "@/components/ApplyForm";
import { Footer } from "@/components/Footer";
import { IconArrowRight, IconFile } from "@/components/icons";

export const metadata: Metadata = {
  title: "Подати заявку — ГУНП м. Київ",
  description:
    "Вступ до лав Головного управління Національної поліції України в місті Києві. Заповніть анкету кандидата.",
};

export default function ApplyPage() {
  return (
    <>
      <main className="pt-[68px]">
        <header className="relative overflow-hidden border-b border-navy-900/10 bg-navy-950 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, rgba(255,212,0,0.4), transparent 45%), radial-gradient(circle at 85% 80%, rgba(74,124,214,0.5), transparent 50%)",
            }}
          />
          <div className="container-x relative py-16 sm:py-20">
            <nav className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ice/60">
              <Link href="/" className="transition hover:text-white">
                Головна
              </Link>
              <span className="text-ice/30">/</span>
              <span className="text-signal">Заявка</span>
            </nav>
            <span className="eyebrow text-signal/90">
              <IconFile width={13} height={13} /> Набір до служби
            </span>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-5xl">
              Подати заявку до ГУНП м. Київ
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ice/75 sm:text-lg">
              Заповни анкету кандидата уважно та правдиво. Після надсилання вона потрапляє до
              чергової частини та дублюється в Discord управління. Розгляд — до 72 годин.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-ice/70">
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-3 py-2">
                <IconArrowRight width={15} height={15} className="text-signal" />
                Вік від 14 років
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-3 py-2">
                <IconArrowRight width={15} height={15} className="text-signal" />
                Активний Discord
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-3 py-2">
                <IconArrowRight width={15} height={15} className="text-signal" />
                Готовність до RolePlay
              </span>
            </div>
          </div>
        </header>

        <section className="bg-ice py-14 sm:py-20">
          <div className="container-x max-w-3xl">
            <ApplyForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
