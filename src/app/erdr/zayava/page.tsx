import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { StatementForm } from "@/components/erdr/StatementForm";
import { IconFile } from "@/components/icons";

export const metadata: Metadata = {
  title: "Заява про злочин — ЄРДР ГУНП м. Київ",
  description: "Подача заяви про кримінальне правопорушення до Головного слідчого управління.",
};

export default function ZayavaPage() {
  return (
    <>
      <main className="pt-[68px]">
        <header className="relative overflow-hidden border-b border-navy-900/10 bg-navy-950 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, rgba(74,124,214,0.5), transparent 48%)",
            }}
          />
          <div className="container-x relative py-16 sm:py-20">
            <nav className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ice/60">
              <Link href="/" className="transition hover:text-white">Головна</Link>
              <span className="text-ice/30">/</span>
              <Link href="/erdr" className="transition hover:text-white">ЄРДР</Link>
              <span className="text-ice/30">/</span>
              <span className="text-signal">Заява</span>
            </nav>
            <span className="eyebrow text-signal/90">
              <IconFile width={13} height={13} /> Заява про правопорушення
            </span>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-5xl">
              Подати заяву про злочин
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ice/75 sm:text-lg">
              Опишіть подію якомога докладніше. Після реєстрації ви отримаєте номер провадження, за
              яким зможете стежити за розглядом у реєстрі.
            </p>
          </div>
        </header>

        <section className="bg-ice py-14 sm:py-20">
          <div className="container-x max-w-3xl">
            <StatementForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
