"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Reveal } from "./Reveal";
import { unitIcon } from "@/lib/unitIcons";
import { IconClose, IconArrowRight } from "./icons";
import type { Unit } from "@/lib/types";

export function Units({ units }: { units: Unit[] }) {
  const [active, setActive] = useState<Unit | null>(null);
  const list = [...units].sort((a, b) => a.order - b.order);

  return (
    <section id="units" className="relative overflow-hidden bg-navy-950 py-24 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-navy [background-size:44px_44px] opacity-30" />
      <div className="container-x relative">
        <Reveal>
          <span className="eyebrow text-navy-300">
            <span className="h-px w-6 bg-navy-400" /> Підрозділи
          </span>
          <h2 className="mt-4 max-w-2xl font-head text-3xl font-bold tracking-tight sm:text-4xl">
            Напрями однієї роботи
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/60">
            Кожен підрозділ виконує свою роль у забезпеченні безпеки міста. Натисніть картку, щоб
            дізнатися більше.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((u, i) => {
            const Icon = unitIcon(u.icon);
            return (
              <Reveal key={u.id} delay={i * 0.05}>
                <button
                  onClick={() => setActive(u)}
                  className="group flex h-full w-full flex-col items-start rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left backdrop-blur transition hover:-translate-y-1 hover:border-navy-400/40 hover:bg-white/[0.07]"
                >
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-navy-600/30 text-navy-300 ring-1 ring-inset ring-white/10 transition group-hover:bg-navy-500/40 group-hover:text-white">
                    <Icon width={24} height={24} />
                  </div>
                  <h3 className="font-head text-[17px] font-semibold">{u.name}</h3>
                  <p className="mt-1.5 text-[13.5px] text-white/55">{u.short}</p>
                  <span className="mt-4 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-signal opacity-0 transition group-hover:opacity-100">
                    Детальніше <IconArrowRight width={14} height={14} />
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[90] grid place-items-center bg-navy-950/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-navy-900 p-7 shadow-glow"
            >
              <button
                onClick={() => setActive(null)}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg text-steel transition hover:bg-white/10 hover:text-white"
                aria-label="Закрити"
              >
                <IconClose />
              </button>
              {(() => {
                const Icon = unitIcon(active.icon);
                return (
                  <div className="mb-5 grid h-14 w-14 place-items-center rounded-xl bg-navy-600/30 text-navy-300 ring-1 ring-inset ring-white/10">
                    <Icon width={28} height={28} />
                  </div>
                );
              })()}
              <h3 className="font-head text-xl font-bold">{active.name}</h3>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-signal">{active.short}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-white/70">{active.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
