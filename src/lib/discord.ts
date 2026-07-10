import type { Application, Complaint } from "./types";

interface Embed {
  title: string;
  color: number;
  fields: { name: string; value: string; inline?: boolean }[];
  timestamp: string;
  footer?: { text: string };
}

async function send(url: string | undefined, embed: Embed): Promise<void> {
  if (!url) return; // вебхук не налаштований — тихо пропускаємо
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "ГУНП м. Київ", embeds: [embed] }),
    });
  } catch (e) {
    console.error("Discord webhook error:", e);
  }
}

const clip = (s: string, n = 1000) =>
  !s ? "—" : s.length > n ? s.slice(0, n - 1) + "…" : s;

export async function notifyApplication(a: Application): Promise<void> {
  await send(process.env.DISCORD_WEBHOOK_APPLICATIONS, {
    title: "📨 Нова заявка на вступ",
    color: 0x1e5bb8,
    fields: [
      { name: "Ім'я", value: clip(`${a.firstName} ${a.lastName}`, 200), inline: true },
      { name: "Discord", value: clip(a.discord, 200), inline: true },
      { name: "Вік", value: clip(a.age, 50), inline: true },
      { name: "Часовий пояс", value: clip(a.timezone, 100), inline: true },
      { name: "Steam", value: clip(a.steam, 200), inline: true },
      { name: "Досвід RP", value: clip(a.rpExperience) },
      { name: "Чому хоче вступити", value: clip(a.whyJoin) },
      { name: "Чому саме ГУНП", value: clip(a.whyGunp) },
      { name: "Покарання", value: clip(a.punishments) },
    ],
    footer: { text: `ID заявки: ${a.id}` },
    timestamp: a.createdAt,
  });
}

export async function notifyComplaint(c: Complaint): Promise<void> {
  await send(process.env.DISCORD_WEBHOOK_COMPLAINTS, {
    title: "⚠️ Нова скарга",
    color: 0xef4444,
    fields: [
      { name: "Від", value: clip(`${c.nickname} (${c.discord})`, 200) },
      { name: "На кого", value: clip(c.against, 200), inline: true },
      { name: "Підрозділ", value: clip(c.unit, 200), inline: true },
      { name: "Дата ситуації", value: clip(c.date, 100), inline: true },
      { name: "Опис", value: clip(c.description) },
      { name: "Докази", value: clip(c.evidence, 500) },
    ],
    footer: { text: `ID скарги: ${c.id}` },
    timestamp: c.createdAt,
  });
}
