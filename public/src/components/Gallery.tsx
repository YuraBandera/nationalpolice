"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { IconClose, IconImage, IconPlay, IconArrowRight } from "./icons";
import type { GalleryItem } from "@/lib/types";

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [idx, setIdx] = useState<number | null>(null);
  const close = useCallback(() => setIdx(null), []);
  const move = useCallback(
    (d: number) => setIdx((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, close, move]);

  const current = idx !== null ? items[idx] : null;

  return (
    <section id="gallery" className="relative bg-white py-24">
      <div className="container-x">
        <Reveal>
          <span className="eyebrow">
            <span className="h-px w-6 bg-navy-500" /> Галерея
          </span>
          <h2 className="mt-4 font-head text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Служба в кадрі
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.id} delay={(i % 4) * 0.05}>
              <button
                onClick={() => setIdx(i)}
                className={`group relative w-full overflow-hidden rounded-xl bg-navy-800 ${
                  i % 5 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"
                }`}
              >
                {it.type === "image" && it.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.src} alt={it.caption} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : it.type === "video" && (it.poster || it.src) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.poster || ""} alt={it.caption} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-700 to-navy-950 text-white/25">
                    {it.type === "video" ? <IconPlay width={30} height={30} /> : <IconImage width={30} height={30} />}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                {it.type === "video" && (
                  <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md bg-navy-950/70 text-white backdrop-blur">
                    <IconPlay width={13} height={13} />
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-left text-[12px] font-medium text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  {it.caption}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[95] grid place-items-center bg-navy-950/90 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              onClick={close}
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Закрити"
            >
              <IconClose />
            </button>
            {items.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); move(-1); }}
                  className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 rotate-180 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Попереднє"
                >
                  <IconArrowRight />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); move(1); }}
                  className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Наступне"
                >
                  <IconArrowRight />
                </button>
              </>
            )}
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[82vh] w-full max-w-4xl overflow-hidden rounded-2xl"
            >
              {current.type === "video" && current.src ? (
                <video src={current.src} poster={current.poster} controls autoPlay className="max-h-[82vh] w-full bg-black" />
              ) : current.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.src} alt={current.caption} className="max-h-[82vh] w-full object-contain" />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-navy-900 text-white/30">
                  Немає медіафайлу
                </div>
              )}
            </motion.div>
            <p className="absolute inset-x-0 bottom-6 text-center text-sm text-white/80">{current.caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
