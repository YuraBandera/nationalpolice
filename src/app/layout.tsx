import type { Metadata } from "next";
import { Unbounded, Golos_Text, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { SiteChrome } from "@/components/SiteChrome";

const display = Unbounded({ subsets: ["cyrillic", "latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const head = Golos_Text({ subsets: ["cyrillic", "latin"], weight: ["500", "600", "700"], variable: "--font-head" });
const body = Inter({ subsets: ["cyrillic", "latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["cyrillic", "latin"], weight: ["400", "500", "600"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "ГУНП м. Київ — НАШЕ Київ | Національна поліція",
  description:
    "Офіційний сайт Головного управління Національної поліції України в місті Києві. Рольовий проєкт «НАШЕ Київ» у Roblox. Служимо та захищаємо.",
  keywords: ["ГУНП", "Київ", "поліція", "НАШЕ Київ", "Roblox", "RP"],
  icons: { icon: "/npu_logo.png", apple: "/npu_logo.png" },
  openGraph: { title: "ГУНП м. Київ — НАШЕ Київ", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${display.variable} ${head.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <ToastProvider>
          <SiteChrome />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
