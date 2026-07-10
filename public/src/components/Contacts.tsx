"use client";

import { Reveal } from "./Reveal";
import { IconDiscord, IconExternal, IconMail, IconClock, IconMapPin, IconPlay } from "./icons";
import type { Contacts as C } from "@/lib/types";

export function Contacts({ contacts }: { contacts: C }) {
  const cards = [
    { Icon: IconDiscord, label: "Discord-сервер", value: "Приєднатися до спільноти", href: contacts.discord },
    { Icon: IconPlay, label: "Roblox-гра", value: "Грати «НАШЕ Київ»", href: contacts.robloxUrl },
    { Icon: IconMail, label: "Електронна пошта", value: contacts.email, href: `mailto:${contacts.email}` },
    { Icon: IconClock, label: "Час роботи", value: contacts.hours, href: null },
  ];

  return (
    <section id="contacts" className="relative overflow-hidden bg-navy-950 py-24 text-white">
      <div className="container-x relative">
        <Reveal>
          <span className="eyebrow text-navy-300">
            <span className="h-px w-6 bg-navy-400" /> Контакти
          </span>
          <h2 className="mt-4 font-head text-3xl font-bold tracking-tight sm:text-4xl">Зв'язатися з нами</h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map((c, i) => {
              const inner = (
                <div className="flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition group-hover:border-navy-400/40 group-hover:bg-white/[0.07]">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-600/30 text-navy-300 ring-1 ring-inset ring-white/10">
                    <c.Icon width={22} height={22} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">{c.label}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-[15px] font-semibold text-white">
                      <span className="truncate">{c.value}</span>
                      {c.href && <IconExternal width={13} height={13} className="shrink-0 text-navy-300" />}
                    </div>
                  </div>
                </div>
              );
              return (
                <Reveal key={c.label} delay={i * 0.05}>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noreferrer" className="group block h-full">
                      {inner}
                    </a>
                  ) : (
                    <div className="group h-full">{inner}</div>
                  )}
                </Reveal>
              );
            })}

            {contacts.socials.length > 0 && (
              <Reveal delay={0.2} className="sm:col-span-2">
                <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">Соцмережі:</span>
                  {contacts.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-[13px] text-white/80 transition hover:border-navy-400/40 hover:text-white"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* Декоративна «карта» */}
          <Reveal delay={0.1}>
            <div className="relative h-full min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-navy-900">
              <div className="absolute inset-0 bg-grid-navy [background-size:32px_32px] opacity-40" />
              <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 400" fill="none">
                <path d="M40 120 L160 60 L280 110 L360 90" stroke="#2E71D6" strokeWidth="2" />
                <path d="M60 300 L140 220 L240 250 L340 200" stroke="#2E71D6" strokeWidth="2" />
                <path d="M160 60 L140 220" stroke="#2E71D6" strokeWidth="1.5" />
                <path d="M280 110 L240 250" stroke="#2E71D6" strokeWidth="1.5" />
                <circle cx="180" cy="200" r="6" fill="#FFD400" />
              </svg>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="relative flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-signal" />
                </span>
              </div>
              <div className="absolute bottom-0 left-0 flex items-center gap-2 p-5 text-white/80">
                <IconMapPin width={18} height={18} className="text-signal" />
                <span className="text-sm font-medium">м. Київ • зона патрулювання</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
