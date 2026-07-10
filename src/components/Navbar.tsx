"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Emblem } from "./Emblem";
import { NAV_LINKS } from "@/lib/site";
import { IconMenu, IconClose } from "./icons";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/10 bg-navy-950/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="container-x flex h-[68px] items-center justify-between">
        <Link href="/#home" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Emblem className="h-9 w-9" />
          <span className="leading-tight text-white">
            <span className="block font-head text-[15px] font-bold tracking-tight">ГУНП м. Київ</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
              НАШЕ Київ
            </span>
          </span>
        </Link>

        {/* Десктоп */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-[13.5px] font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/complaint" className="btn-ghost h-10 px-4 text-[13px]">
            Подати скаргу
          </Link>
          <Link href="/apply" className="btn-signal h-10 px-4 text-[13px]">
            Подати заявку
          </Link>
        </div>

        {/* Мобільний тригер */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg text-white lg:hidden"
          aria-label="Меню"
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </nav>

      {/* Мобільне меню */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/10 bg-navy-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-[15px] font-medium text-white/85 transition hover:bg-white/5"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/complaint" onClick={() => setOpen(false)} className="btn-ghost">
                  Скарга
                </Link>
                <Link href="/apply" onClick={() => setOpen(false)} className="btn-signal">
                  Заявка
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
