import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { InvestigatorPanel } from "@/components/erdr/InvestigatorPanel";
import { IconFile } from "@/components/icons";

export const metadata: Metadata = {
  title: "Панель слідчого — ЄРДР ГУНП м. Київ",
  robots: { index: false },
};

export default function PanelPage() {
  return (
    <>
      <main className="min-h-screen bg-navy-950 pt-[68px]">
        <div className="container-x py-10">
          <nav className="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ice/50">
            <Link href="/erdr" className="transition hover:text-white">ЄРДР</Link>
            <span className="text-ice/30">/</span>
            <span className="text-signal">Панель слідчого</span>
          </nav>
          <div className="mb-8 flex items-center gap-2">
            <IconFile width={18} height={18} className="text-signal" />
            <h1 className="font-head text-2xl font-bold text-white">Робочий кабінет ГСУ</h1>
          </div>
          <InvestigatorPanel />
        </div>
      </main>
      <Footer />
    </>
  );
}
