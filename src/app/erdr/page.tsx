import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ErdrLookup } from "@/components/erdr/ErdrLookup";
import { IconFile, IconArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "ЄРДР — Головне слідче управління ГУНП м. Київ",
  description:
    "Єдиний реєстр досудових розслідувань. Перевірка статусу провадження за номером та подача заяви про кримінальне правопорушення.",
};

export default function ErdrPage() {
  return (
    <>
      <main className="pt-[68px]">
        <header className="relative overflow-hidden border-b border-navy-900/10 bg-navy-950 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 82% 18%, rgba(74,124,214,0.5), transparent 48%), radial-gradient(circle at 12% 88%, rgba(255,212,0,0.25), transparent 50%)",
            }}
          />
          <div className="container-x relative py-16 sm:py-20">
            <nav className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ice/60">
              <Link href="/" className="transition hover:text-white">Головна</Link>
              <span className="text-ice/30">/</span>
              <span className="text-signal">ЄРДР</span>
            </nav>
            <span className="eyebrow text-signal/90">
              <IconFile width={13} height={13} /> Головне слідче управління
            </span>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-5xl">
              Єдиний реєстр досудових розслідувань
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ice/75 sm:text-lg">
              Перевірте статус кримінального провадження за його номером або подайте заяву про
              правопорушення. Кожна заява реєструється й отримує унікальний номер для відстеження.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/erdr/zayava"
                className="inline-flex items-center gap-2 rounded-xl bg-signal px-5 py-3 text-sm font-semibold text-navy-950 transition hover:brightness-105"
              >
                Подати заяву про злочин <IconArrowRight width={16} height={16} />
              </Link>
              <Link
                href="/erdr/panel"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-ice/80 transition hover:bg-white/10 hover:text-white"
              >
                Вхід для слідчих
              </Link>
            </div>
          </div>
        </header>

        <section className="bg-ice py-14 sm:py-20">
          <div className="container-x max-w-3xl">
            <h2 className="mb-6 font-head text-2xl font-bold text-navy-900">Перевірити провадження</h2>
            <ErdrLookup />
            <p className="mt-6 text-center text-sm text-navy-800/55">
              Немає номера, але постраждали від правопорушення?{" "}
              <Link href="/erdr/zayava" className="font-semibold text-navy-700 underline">
                Подайте заяву
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
