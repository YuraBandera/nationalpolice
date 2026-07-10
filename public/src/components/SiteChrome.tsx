"use client";

import { usePathname } from "next/navigation";
import { Preloader } from "./Preloader";
import { Navbar } from "./Navbar";
import { ScrollToTop } from "./ScrollToTop";

export function SiteChrome() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <>
      <Preloader />
      <Navbar />
      <ScrollToTop />
    </>
  );
}
