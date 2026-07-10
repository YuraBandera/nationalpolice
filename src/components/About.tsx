"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { IconShieldCheck, IconTarget, IconUsers, IconGavel } from "./icons";
import type { StatItem } from "@/lib/types";

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1400;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString("uk-UA")}
      {suffix}
    </span>
  );
}

const PILLARS = [
  { Icon: IconShieldCheck, title: "Охорона правопорядку", text: "Цілодобове патрулювання й миттєве реагування на виклики містян." },
  { Icon: IconTarget, title: "Забезпечення безпеки", text: "Контроль обстановки, супровід масових заходів, захист об'єктів." },
  { Icon: IconGavel, title: "Боротьба зі злочинністю", text: "Оперативна робота, розслідування та притягнення винних до відповідальності." },
  { Icon: IconUsers, title: "Підтримка громадян", text: "Відкритий діалог, прийом звернень і допомога кожному, хто її потребує." },
];

export function About({ stats }: { stats: StatItem[] }) {
  return (
    <section id="about" className="relative bg-ice py-24">
      <div className="container-x">
        <Reveal>
          <span className="eyebrow">
            <span className="h-px w-6 bg-navy-500" /> Про управління
          </span>
          <h2 className="mt-4 max-w-2xl font-head text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Управління, якому довіряє місто
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-navy-800/70">
            Головне управління Національної поліції України в місті Києві забезпечує охорону
            правопорядку, безпеку громадян та протидію злочинності. Ми працюємо для того, щоб кожен
            мешканець столиці почувався захищеним.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-navy-900/8 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-navy-500/30">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-navy-700 text-white transition group-hover:bg-navy-600">
                  <p.Icon width={22} height={22} />
                </div>
                <h3 className="font-head text-[16px] font-semibold text-navy-900">{p.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-navy-800/65">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Табло статистики */}
        <Reveal delay={0.1}>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-navy-900 shadow-glow">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-3">
              <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-steel">
                <span className="h-2 w-2 animate-pulse-led rounded-full bg-good" />
                Показники управління
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-steel">Live</span>
            </div>
            <div className="grid grid-cols-2 divide-white/10 lg:grid-cols-4 lg:divide-x">
              {stats.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="px-6 py-8 [&:nth-child(-n+2)]:border-b [&:nth-child(-n+2)]:border-white/10 lg:[&:nth-child(-n+2)]:border-b-0"
                >
                  <div className="font-display text-4xl font-extrabold text-white lg:text-5xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-navy-300">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
