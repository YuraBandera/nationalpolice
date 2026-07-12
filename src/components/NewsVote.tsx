"use client";

import { useEffect, useState } from "react";
import { IconThumbUp, IconThumbDown } from "./icons";

type Vote = "like" | "dislike" | null;

export function NewsVote({
  newsId,
  likes: likes0,
  dislikes: dislikes0,
  size = "md",
}: {
  newsId: string;
  likes: number;
  dislikes: number;
  size?: "sm" | "md";
}) {
  const [likes, setLikes] = useState(likes0);
  const [dislikes, setDislikes] = useState(dislikes0);
  const [my, setMy] = useState<Vote>(null);
  const [busy, setBusy] = useState(false);

  const storeKey = `gunp_vote_${newsId}`;

  useEffect(() => {
    try {
      const v = localStorage.getItem(storeKey) as Vote;
      if (v === "like" || v === "dislike") setMy(v);
    } catch {
      /* localStorage недоступний — ігноруємо */
    }
  }, [storeKey]);

  const persist = (v: Vote) => {
    try {
      if (v) localStorage.setItem(storeKey, v);
      else localStorage.removeItem(storeKey);
    } catch {
      /* ignore */
    }
  };

  async function send(likeD: number, dislikeD: number) {
    try {
      const r = await fetch("/api/news/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: newsId, likes: likeD, dislikes: dislikeD }),
      });
      if (r.ok) {
        const d = await r.json();
        if (typeof d.likes === "number") setLikes(d.likes);
        if (typeof d.dislikes === "number") setDislikes(d.dislikes);
      }
    } catch {
      /* мережева помилка — лишаємо оптимістичні значення */
    }
  }

  async function vote(target: "like" | "dislike") {
    if (busy) return;
    setBusy(true);

    let likeD = 0;
    let dislikeD = 0;
    let next: Vote = my;

    if (my === target) {
      // повторний клік — скасувати голос
      if (target === "like") likeD = -1;
      else dislikeD = -1;
      next = null;
    } else if (my === null) {
      if (target === "like") likeD = 1;
      else dislikeD = 1;
      next = target;
    } else {
      // перемикання з одного на інший
      if (target === "like") {
        likeD = 1;
        dislikeD = -1;
      } else {
        dislikeD = 1;
        likeD = -1;
      }
      next = target;
    }

    // оптимістичне оновлення
    setLikes((v) => Math.max(0, v + likeD));
    setDislikes((v) => Math.max(0, v + dislikeD));
    setMy(next);
    persist(next);

    await send(likeD, dislikeD);
    setBusy(false);
  }

  const pad = size === "sm" ? "px-2.5 py-1.5 text-[13px]" : "px-4 py-2.5 text-sm";
  const ic = size === "sm" ? 15 : 18;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => vote("like")}
        disabled={busy}
        aria-pressed={my === "like"}
        className={`inline-flex items-center gap-2 rounded-xl border font-semibold transition disabled:opacity-60 ${pad} ${
          my === "like"
            ? "border-good/40 bg-good/12 text-good"
            : "border-navy-900/12 bg-white text-navy-700 hover:border-good/30 hover:bg-good/5 hover:text-good"
        }`}
      >
        <IconThumbUp width={ic} height={ic} />
        {likes}
      </button>
      <button
        onClick={() => vote("dislike")}
        disabled={busy}
        aria-pressed={my === "dislike"}
        className={`inline-flex items-center gap-2 rounded-xl border font-semibold transition disabled:opacity-60 ${pad} ${
          my === "dislike"
            ? "border-bad/40 bg-bad/12 text-bad"
            : "border-navy-900/12 bg-white text-navy-700 hover:border-bad/30 hover:bg-bad/5 hover:text-bad"
        }`}
      >
        <IconThumbDown width={ic} height={ic} />
        {dislikes}
      </button>
    </div>
  );
}
