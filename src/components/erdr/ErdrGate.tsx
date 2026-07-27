"use client";

import { useState } from "react";
import Link from "next/link";
import { NickGate } from "./NickGate";
import { ErdrLookup } from "./ErdrLookup";
import { StatementForm } from "./StatementForm";
import { IconFile, IconAlert } from "@/components/icons";

const warning = (
  <div className="mb-6 rounded-xl border border-bad/25 bg-bad/[0.04] p-5">
    <div className="mb-2 flex items-center gap-2 font-semibold text-bad">
      <IconAlert width={18} height={18} />
      Попередження про кримінальну відповідальність
    </div>
    <p className="text-[13.5px] leading-relaxed text-navy-800/75">
      Доступ до ЄРДР надається виключно для перевірки та подання відомостей у межах правил проєкту.{" "}
      <span className="font-semibold text-navy-900">Несанкціоноване втручання</span> в роботу реєстру,
      внесення завідомо неправдивих відомостей або використання чужих даних тягне відповідальність
      згідно зі <span className="font-mono font-semibold">ст. 5.6</span> та{" "}
      <span className="font-mono font-semibold">ст. 5.4</span> ККУ. Усі дії журналюються.
    </p>
  </div>
);

const footer = (
  <Link
    href="/erdr/panel"
    className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 transition hover:text-navy-900"
  >
    <IconFile width={15} height={15} /> Вхід для слідчих (службовий доступ)
  </Link>
);

export function ErdrGate() {
  const [tab, setTab] = useState<"lookup" | "statement">("lookup");

  return (
    <NickGate title="Єдиний реєстр досудових розслідувань" warning={warning} footer={footer}>
      {(nick) => (
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 flex flex-wrap gap-1 rounded-xl border border-navy-900/10 bg-white p-1">
            <button
              onClick={() => setTab("lookup")}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                tab === "lookup" ? "bg-navy-900 text-white" : "text-navy-800/60 hover:text-navy-900"
              }`}
            >
              Перевірити провадження
            </button>
            <button
              onClick={() => setTab("statement")}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                tab === "statement" ? "bg-navy-900 text-white" : "text-navy-800/60 hover:text-navy-900"
              }`}
            >
              Подати заяву про злочин
            </button>
          </div>

          {tab === "lookup" ? <ErdrLookup /> : <StatementForm lockedApplicant={nick} />}
        </div>
      )}
    </NickGate>
  );
}
