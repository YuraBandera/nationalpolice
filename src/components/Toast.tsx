"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { IconCheck, IconAlert, IconClose } from "./icons";

type Kind = "success" | "error" | "info";
interface Toast {
  id: number;
  kind: Kind;
  text: string;
}

const ToastCtx = createContext<(text: string, kind?: Kind) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const push = useCallback((text: string, kind: Kind = "info") => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, kind, text }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 4200);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="pointer-events-auto flex max-w-md items-center gap-3 rounded-xl border border-white/10 bg-navy-900/95 px-4 py-3 text-sm text-white shadow-glow backdrop-blur"
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ${
                  t.kind === "success" ? "bg-good/20 text-good" : t.kind === "error" ? "bg-bad/20 text-bad" : "bg-navy-500/30 text-navy-300"
                }`}
              >
                {t.kind === "error" ? <IconAlert width={15} height={15} /> : <IconCheck width={15} height={15} />}
              </span>
              <span className="leading-snug">{t.text}</span>
              <button
                onClick={() => setItems((s) => s.filter((x) => x.id !== t.id))}
                className="ml-1 text-steel transition hover:text-white"
                aria-label="Закрити"
              >
                <IconClose width={15} height={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}
