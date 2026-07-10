"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { NewsCard, NewsReader } from "@/components/NewsSection";
import { IconNews } from "@/components/icons";
import type { NewsItem } from "@/lib/types";

export function NewsList({ news }: { news: NewsItem[] }) {
  const [open, setOpen] = useState<NewsItem | null>(null);

  if (news.length === 0) {
    return (
      <div className="glass flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center text-steel">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-50 text-navy-500">
          <IconNews width={24} height={24} />
        </span>
        <p className="font-head text-lg text-navy-800">Новин поки немає</p>
        <p className="max-w-md text-sm">
          Щойно пресслужба опублікує першу хроніку, вона зʼявиться тут.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {news.map((n, i) => (
          <Reveal key={n.id} delay={(i % 3) * 0.07}>
            <NewsCard n={n} onOpen={setOpen} />
          </Reveal>
        ))}
      </div>
      <NewsReader item={open} onClose={() => setOpen(null)} />
    </>
  );
}
