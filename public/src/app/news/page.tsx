import type { Metadata } from "next";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { NewsList } from "@/components/NewsList";
import { Footer } from "@/components/Footer";
import { IconNews } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Новини — ГУНП м. Київ",
  description:
    "Офіційна хроніка Головного управління Національної поліції України в місті Києві: оголошення, звіти, події управління.",
};

export default async function NewsPage() {
  const db = await readDb();
  const news = [...db.news].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <>
      <main className="pt-[68px]">
        <header className="relative overflow-hidden border-b border-navy-900/10 bg-navy-950 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(74,124,214,0.55), transparent 50%), radial-gradient(circle at 90% 70%, rgba(255,212,0,0.35), transparent 45%)",
            }}
          />
          <div className="container-x relative py-16 sm:py-20">
            <nav className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ice/60">
              <Link href="/" className="transition hover:text-white">
                Головна
              </Link>
              <span className="text-ice/30">/</span>
              <span className="text-signal">Новини</span>
            </nav>
            <span className="eyebrow text-signal/90">
              <IconNews width={13} height={13} /> Хроніка управління
            </span>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-5xl">
              Новини та оголошення
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ice/75 sm:text-lg">
              Офіційні повідомлення пресслужби ГУНП м. Київ: підсумки чергувань, набори, події та
              рішення керівництва.
            </p>
          </div>
        </header>

        <section className="bg-ice py-14 sm:py-20">
          <div className="container-x">
            <NewsList news={news} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
