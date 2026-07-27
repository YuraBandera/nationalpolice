import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { GatedOffense } from "@/components/erdr/GatedOffense";
import { IconCar } from "@/components/icons";

export const metadata: Metadata = {
  title: "Заява про адміністративне правопорушення — ГУНП м. Київ",
  description: "Повідомлення про порушення ПДР та інші адміністративні правопорушення.",
};

export default function AdminOffensePage() {
  return (
    <>
      <main className="pt-[68px]">
        <header className="relative overflow-hidden border-b border-navy-900/10 bg-navy-950 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: "radial-gradient(circle at 82% 18%, rgba(245,158,11,0.4), transparent 48%)" }}
          />
          <div className="container-x relative py-14 sm:py-16">
            <nav className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ice/60">
              <Link href="/" className="transition hover:text-white">Головна</Link>
              <span className="text-ice/30">/</span>
              <span className="text-signal">Адмінправопорушення</span>
            </nav>
            <span className="eyebrow text-signal/90">
              <IconCar width={13} height={13} /> Адміністративне провадження
            </span>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Заява про адміністративне правопорушення
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ice/70">
              Повідомте про порушення ПДР чи інше адміністративне правопорушення. Для входу пройдіть
              ідентифікацію за ніком Roblox.
            </p>
          </div>
        </header>

        <section className="bg-ice py-12 sm:py-16">
          <div className="container-x">
            <GatedOffense />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
