"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Emblem } from "./Emblem";
import { IconArrowRight, IconAlert } from "./icons";

function KyivClock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const tick = () =>
      setT(
        new Intl.DateTimeFormat("uk-UA", {
          timeZone: "Europe/Kyiv",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date())
      );
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  return <span className="font-mono tabular-nums">{t}</span>;
}

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Відео-тло. Поклади файл у /public/hero.mp4 (і за бажанням hero-poster.jpg). */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Запасне тло, поки немає відео */}
      <div className="absolute inset-0 -z-10 bg-navy-950 bg-gradient-to-br from-navy-800 via-navy-950 to-navy-900" />
      <div className="absolute inset-0 -z-10 bg-grid-navy [background-size:44px_44px] opacity-40" />

      {/* Затемнення поверх відео (~55%) */}
      <div className="absolute inset-0 bg-navy-950/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-navy-950/40" />

      <div className="container-x relative z-10 py-28">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="mb-7 flex items-center gap-4">
            <Emblem className="h-16 w-16 drop-shadow-[0_8px_24px_rgba(0,0,0,.5)]" />
            <div className="hidden h-12 w-px bg-white/20 sm:block" />
            <span className="hidden font-mono text-[11px] uppercase leading-relaxed tracking-[0.24em] text-signal sm:block">
              Головне управління
              <br />
              Національної поліції України
            </span>
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
            Національна поліція
            <br />
            <span className="text-navy-300">в місті Києві</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            Служимо та захищаємо громадян міста Києва. Рольовий проєкт{" "}
            <span className="font-semibold text-white">«НАШЕ Київ»</span> у Roblox.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/apply" className="btn-signal px-6 py-3.5 text-[15px]">
              Подати заявку
              <IconArrowRight width={18} height={18} />
            </Link>
            <Link href="/complaint" className="btn-ghost border-white/20 bg-white/5 px-6 py-3.5 text-[15px] text-white hover:bg-white/10">
              <IconAlert width={17} height={17} />
              Подати скаргу
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Живий статус-бар чергової частини */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-navy-950/60 backdrop-blur-md"
      >
        <div className="container-x flex flex-wrap items-center justify-between gap-y-2 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse-led rounded-full bg-good" />
            Чергова частина • на зв'язку
          </span>
          <span className="hidden sm:inline">Оперативна обстановка: штатна</span>
          <span className="flex items-center gap-2">
            Київ <KyivClock />
          </span>
        </div>
      </motion.div>
    </section>
  );
}
