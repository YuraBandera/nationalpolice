"use client";

import { NickGate } from "./erdr/NickGate";
import { ApplyForm } from "./ApplyForm";
import type { ApplicationQuestion } from "@/lib/types";

export function GatedApply({ questions }: { questions: ApplicationQuestion[] }) {
  return (
    <NickGate title="Подання заявки на вступ" subtitle="Для подання заявки пройдіть ідентифікацію за ніком Roblox.">
      {() => <ApplyForm questions={questions} />}
    </NickGate>
  );
}
