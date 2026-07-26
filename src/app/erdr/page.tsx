import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ErdrGate } from "@/components/erdr/ErdrGate";
import { IconFile } from "@/components/icons";

export const metadata: Metadata = {
  title: "ЄРДР — Головне слідче управління ГУНП м. Київ",
  description:
    "Єдиний реєстр досудових розслідувань. Перевірка статусу провадження та подання заяви про кримінальне правопорушення.",
};

export default function ErdrPage() {
  return (
    <>
      <main className="pt-[68px]">
        <header className="relative overflow-hidden border-b border-navy-900/10 bg-navy-950 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 82% 18%, rgba(74,124,214,0.5), transparent 48%), radial-gradient(circle at 12% 88%, rgba(255,212,0,0.22), transparent 50%)",
            }}
          />
          <div className="container-x relative py-14 sm:py-16">
            <nav className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ice/60">
              <Link href="/" className="transition hover:text-white">Головна</Link>
              <span className="text-ice/30">/</span>
              <span className="text-signal">ЄРДР</span>
            </nav>
            <span className="eyebrow text-signal/90">
              <IconFile width={13} height={13} /> Офіційний державний реєстр
            </span>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Єдиний реєстр досудових розслідувань
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ice/70">
              Для доступу до реєстру пройдіть ідентифікацію. Усі дії журналюються.
            </p>
          </div>
        </header>

        <section className="bg-ice py-12 sm:py-16">
          <div className="container-x">
            <ErdrGate />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
