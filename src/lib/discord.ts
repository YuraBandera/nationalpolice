import type { Application, Complaint } from "./types";
import { resolveRoblox } from "./roblox";

interface Embed {
  title: string;
  color: number;
  fields: { name: string; value: string; inline?: boolean }[];
  timestamp: string;
  footer?: { text: string };
  thumbnail?: { url: string };
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
  const base = [
    { name: "Ім'я", value: clip(`${a.firstName} ${a.lastName}`, 200), inline: true },
    { name: "Discord", value: clip(a.discord, 200), inline: true },
    { name: "Вік", value: clip(a.age, 50), inline: true },
  ];
  const answerFields = (a.answers || [])
    .filter((x) => x.value && x.value.trim())
    .map((x) => ({ name: clip(x.label, 200), value: clip(x.value) }));
  // застарілі заявки без answers — показуємо старі поля, якщо є
  const legacy = !a.answers
    ? [
        { name: "Досвід RP", value: clip(a.rpExperience || "") },
        { name: "Чому хоче вступити", value: clip(a.whyJoin || "") },
        { name: "Чому саме ГУНП", value: clip(a.whyGunp || "") },
      ].filter((f) => f.value !== "—")
    : [];

  await send(process.env.DISCORD_WEBHOOK_APPLICATIONS, {
    title: "📨 Нова заявка на вступ",
    color: 0x1e5bb8,
    fields: [...base, ...answerFields, ...legacy].slice(0, 24),
    footer: { text: `ID заявки: ${a.id}` },
    timestamp: a.createdAt,
  });
}

export async function notifyComplaint(c: Complaint): Promise<void> {
  // Резолвимо профілі обох сторін (best-effort — не блокуємо надовго)
  const [self, target] = await Promise.all([
    c.robloxSelf ? resolveRoblox(c.robloxSelf).catch(() => null) : Promise.resolve(null),
    c.robloxTarget ? resolveRoblox(c.robloxTarget).catch(() => null) : Promise.resolve(null),
  ]);

  const selfVal = self
    ? `[${self.displayName} (@${self.name})](${self.profileUrl})`
    : c.robloxSelf
      ? `${c.robloxSelf} (профіль не знайдено)`
      : "—";
  const targetVal = target
    ? `[${target.displayName} (@${target.name})](${target.profileUrl})`
    : c.robloxTarget
      ? `${c.robloxTarget} (профіль не знайдено)`
      : "—";

  await send(process.env.DISCORD_WEBHOOK_COMPLAINTS, {
    title: "⚠️ Нова скарга",
    color: 0xef4444,
    thumbnail: target?.avatar ? { url: target.avatar } : undefined,
    fields: [
      { name: "Від (Discord)", value: clip(c.discord, 200), inline: true },
      { name: "Roblox заявника", value: clip(selfVal, 300), inline: true },
      { name: "Roblox порушника", value: clip(targetVal, 300) },
      { name: "Discord порушника", value: clip(c.against, 200), inline: true },
      { name: "Підрозділ", value: clip(c.unit, 200), inline: true },
      { name: "Дата ситуації", value: clip(c.date, 100), inline: true },
      { name: "Опис", value: clip(c.description) },
      { name: "Докази", value: clip(c.evidence, 500) },
    ],
    footer: { text: `ID скарги: ${c.id}` },
    timestamp: c.createdAt,
  });
}

export interface AdminOffenseInput {
  applicant: string; // Roblox нік заявника
  offender: string; // Roblox нік порушника
  vehicle: string; // номер ТЗ
  article: string; // стаття КУпАП
  articleTitle: string;
  punishment: string;
  place: string;
  when: string;
  circumstances: string;
  evidence: string;
}

export async function notifyAdminOffense(o: AdminOffenseInput): Promise<void> {
  const [self, target] = await Promise.all([
    o.applicant ? resolveRoblox(o.applicant).catch(() => null) : Promise.resolve(null),
    o.offender ? resolveRoblox(o.offender).catch(() => null) : Promise.resolve(null),
  ]);
  const selfVal = self ? `[${self.displayName} (@${self.name})](${self.profileUrl})` : o.applicant;
  const targetVal = target ? `[${target.displayName} (@${target.name})](${target.profileUrl})` : o.offender;

  await send(process.env.DISCORD_WEBHOOK_ADMIN, {
    title: "🚓 Заява про адміністративне правопорушення",
    color: 0xf59e0b,
    thumbnail: target?.avatar ? { url: target.avatar } : undefined,
    fields: [
      { name: "Стаття КУпАП", value: `ст. ${o.article} — ${o.articleTitle}` },
      { name: "Санкція", value: clip(o.punishment, 300), inline: true },
      { name: "Номер ТЗ", value: clip(o.vehicle || "—", 60), inline: true },
      { name: "Порушник (Roblox)", value: clip(targetVal, 300) },
      { name: "Заявник (Roblox)", value: clip(selfVal, 300) },
      { name: "Місце", value: clip(o.place || "—", 200), inline: true },
      { name: "Час", value: clip(o.when || "—", 100), inline: true },
      { name: "Обставини", value: clip(o.circumstances) },
      { name: "Доказ", value: clip(o.evidence, 500) },
    ],
    timestamp: new Date().toISOString(),
  });
}
