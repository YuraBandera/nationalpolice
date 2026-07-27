"use client";

import { NickGate } from "./erdr/NickGate";
import { ComplaintForm } from "./ComplaintForm";

export function GatedComplaint() {
  return (
    <NickGate title="Подання скарги" subtitle="Скарга подається від вашого імені. Нік перевіряється в Roblox.">
      {(nick) => <ComplaintForm lockedRoblox={nick} />}
    </NickGate>
  );
}
