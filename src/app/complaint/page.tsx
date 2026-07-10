import type { Metadata } from "next";
import Link from "next/link";
import { ComplaintForm } from "@/components/ComplaintForm";
import { Footer } from "@/components/Footer";
import { IconAlert, IconArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Подати скаргу — ГУНП м. Київ",
  description:
    "Форма звернення щодо дій працівника Головного управління Національної поліції України в місті Києві.",
};

export default function ComplaintPage() {
  return (
    <>
      <main className="pt-[68px]">
        <header className="relative overflow-hidden border-b border-navy-900/10 bg-navy-950 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, rgba(224,79,79,0.45), transparent 45%), radial-gradient(circle at 15% 85%, rgba(74,124,214,0.5), transparent 50%)",
            }}
          />
          <div className="container-x relative py-16 sm:py-20">
            <nav className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ice/60">
              <Link href="/" className="transition hover:text-white">
                Головна
              </Link>
              <span className="text-ice/30">/</span>
              <span className="text-signal">Скарга</span>
            </nav>
            <span className="eyebrow text-signal/90">
              <IconAlert width={13} height={13} /> Внутрішня безпека
            </span>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-5xl">
              Подати скаргу на працівника
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ice/75 sm:text-lg">
              Кожне звернення розглядається відділом внутрішньої безпеки. Опиши ситуацію максимально
              конкретно та додай посилання на докази — це пришвидшить перевірку.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-ice/70">
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-3 py-2">
                <IconArrowRight width={15} height={15} className="text-signal" />
                Конфіденційність гарантовано
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-3 py-2">
                <IconArrowRight width={15} height={15} className="text-signal" />
                Докази прискорюють розгляд
              </span>
            </div>
          </div>
        </header>

        <section className="bg-ice py-14 sm:py-20">
          <div className="container-x max-w-3xl">
            <ComplaintForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
