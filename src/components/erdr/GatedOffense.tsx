"use client";

import { NickGate } from "./NickGate";
import { AdminOffenseForm } from "./AdminOffenseForm";

export function GatedOffense() {
  return (
    <NickGate title="Заява про адмінправопорушення">
      {(nick) => (
        <div className="mx-auto max-w-3xl">
          <AdminOffenseForm lockedApplicant={nick} />
        </div>
      )}
    </NickGate>
  );
}
