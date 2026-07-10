"use client";

import { Reveal } from "./Reveal";
import type { Leader } from "@/lib/types";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Leadership({ leaders }: { leaders: Leader[] }) {
  return (
    <section id="leadership" className="relative bg-white py-24">
      <div className="container-x">
        <Reveal>
          <span className="eyebrow">
            <span className="h-px w-6 bg-navy-500" /> Керівництво
          </span>
          <h2 className="mt-4 font-head text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Командний склад управління
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.06}>
              <article className="group h-full overflow-hidden rounded-2xl border border-navy-900/8 bg-ice shadow-card transition hover:-translate-y-1 hover:shadow-glow">
                <div className="relative aspect-[4/5] overflow-hidden bg-navy-800">
                  {l.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.photo} alt={l.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-700 to-navy-950">
                      <span className="font-display text-5xl font-bold text-white/25">{initials(l.name)}</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-950/85 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="inline-block rounded-md bg-signal/90 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-navy-950">
                      {l.rank}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-head text-[17px] font-semibold text-navy-900">{l.name}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-navy-800/65">{l.bio}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
