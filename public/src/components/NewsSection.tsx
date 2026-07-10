"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "./Reveal";
import { IconClose, IconNews, IconArrowRight } from "./icons";
import type { NewsItem } from "@/lib/types";

export function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso)
  );
}

export function NewsCard({ n, onOpen }: { n: NewsItem; onOpen: (n: NewsItem) => void }) {
  return (
    <button
      onClick={() => onOpen(n)}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-navy-900/8 bg-white text-left shadow-card transition hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-navy-800">
        {n.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={n.image} alt={n.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-700 to-navy-950 text-white/25">
            <IconNews width={40} height={40} />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-md bg-navy-950/70 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-white backdrop-blur">
          {fmtDate(n.date)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-head text-[17px] font-semibold leading-snug text-navy-900 transition group-hover:text-navy-600">
          {n.title}
        </h3>
        <p className="mt-2 flex-1 text-[14px] leading-relaxed text-navy-800/65">{n.excerpt}</p>
        <span className="mt-4 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-navy-500">
          {n.author} <IconArrowRight width={13} height={13} className="ml-auto" />
        </span>
      </div>
    </button>
  );
}

export function NewsReader({ item, onClose }: { item: NewsItem | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-start justify-center overflow-y-auto bg-navy-950/70 p-4 py-10 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-glow"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-lg bg-navy-950/50 text-white backdrop-blur transition hover:bg-navy-950/70"
              aria-label="Закрити"
            >
              <IconClose />
            </button>
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.title} className="aspect-[16/9] w-full object-cover" />
            ) : (
              <div className="flex aspect-[16/7] w-full items-center justify-center bg-gradient-to-br from-navy-700 to-navy-950 text-white/20">
                <IconNews width={48} height={48} />
              </div>
            )}
            <div className="p-7 sm:p-9">
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wide text-navy-500">
                <span>{fmtDate(item.date)}</span>
                <span className="h-1 w-1 rounded-full bg-steel" />
                <span>{item.author}</span>
              </div>
              <h1 className="mt-3 font-head text-2xl font-bold leading-tight text-navy-900">{item.title}</h1>
              <div className="mt-5 space-y-4 text-[15.5px] leading-relaxed text-navy-800/80">
                {item.body.split("\n").filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function NewsSection({ news }: { news: NewsItem[] }) {
  const [open, setOpen] = useState<NewsItem | null>(null);
  const top = news.slice(0, 3);

  return (
    <section id="news" className="relative bg-ice py-24">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">
                <span className="h-px w-6 bg-navy-500" /> Новини
              </span>
              <h2 className="mt-4 font-head text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
                Хроніка управління
              </h2>
            </div>
            <Link href="/news" className="btn-ghost">
              Усі новини <IconArrowRight width={16} height={16} />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {top.map((n, i) => (
            <Reveal key={n.id} delay={i * 0.07}>
              <NewsCard n={n} onOpen={setOpen} />
            </Reveal>
          ))}
        </div>
      </div>
      <NewsReader item={open} onClose={() => setOpen(null)} />
    </section>
  );
}
