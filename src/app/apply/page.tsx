import type { Metadata } from "next";
import Link from "next/link";
import { ApplyForm } from "@/components/ApplyForm";
import { Footer } from "@/components/Footer";
import { readDb } from "@/lib/db";
import { IconArrowRight, IconFile, IconLock } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Подати заявку — ГУНП м. Київ",
  description:
    "Вступ до лав Головного управління Національної поліції України в місті Києві. Заповніть анкету кандидата.",
};

export default async function ApplyPage() {
  const db = await readDb();
  const open = db.settings.recruitmentOpen;
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
            {open ? (
              <ApplyForm questions={db.applicationQuestions} />
            ) : (
              <div className="rounded-2xl border border-navy-900/10 bg-white p-8 text-center shadow-card sm:p-12">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-navy-50 text-navy-500">
                  <IconLock width={28} height={28} />
                </span>
                <h2 className="mt-6 font-head text-2xl font-bold text-navy-900 sm:text-3xl">
                  {db.settings.recruitmentClosedTitle}
                </h2>
                <p className="mx-auto mt-4 max-w-xl whitespace-pre-wrap text-[15px] leading-relaxed text-navy-800/85 sm:text-lg">
                  {db.settings.recruitmentClosedMessage}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a
                    href={db.contacts.discord}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary px-6 py-3.5 text-[15px]"
                  >
                    Наш Discord
                    <IconArrowRight width={18} height={18} />
                  </a>
                  <Link href="/" className="btn-ghost px-6 py-3.5 text-[15px]">
                    На головну
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
