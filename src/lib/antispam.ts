// Простий антиспам без зовнішніх сервісів. Стан у пам'яті процесу
// (для одного інстансу Railway цього достатньо; скидається при перезапуску).

type Hit = { t: number };
const ipHits = new Map<string, Hit[]>();
const recentBodies = new Map<string, number>(); // hash -> timestamp

/** Реальний IP відвідувача (з урахуванням Cloudflare). */
export function clientIp(request: Request): string {
  const h = request.headers;
  const cf = h.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip")?.trim() || "unknown";
}

/** Проста хеш-функція для тексту (для виявлення дублів). */
function hash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return String(h);
}

export interface SpamCheckOptions {
  /** мінімальний інтервал між надсиланнями з одного IP, мс */
  minGapMs?: number;
  /** максимум надсилань з IP за вікно */
  max?: number;
  /** розмір вікна, мс */
  windowMs?: number;
  /** текст для перевірки на дублі (напр. опис) */
  dupText?: string;
  /** скільки мс вважати однаковий текст дублем */
  dupWindowMs?: number;
}

export interface SpamResult {
  ok: boolean;
  reason?: string;
}

export function checkSpam(ip: string, opts: SpamCheckOptions = {}): SpamResult {
  const now = Date.now();
  const minGapMs = opts.minGapMs ?? 20_000; // 20 c між надсиланнями
  const max = opts.max ?? 6; // не більше 6
  const windowMs = opts.windowMs ?? 60 * 60_000; // за годину
  const dupWindowMs = opts.dupWindowMs ?? 10 * 60_000; // 10 хв

  // періодичне прибирання пам'яті
  if (ipHits.size > 5000) ipHits.clear();
  if (recentBodies.size > 5000) recentBodies.clear();

  const hits = (ipHits.get(ip) || []).filter((h) => now - h.t < windowMs);

  // 1) занадто часто
  if (hits.length > 0) {
    const last = hits[hits.length - 1].t;
    if (now - last < minGapMs) {
      return { ok: false, reason: "Ви надсилаєте занадто часто. Зачекайте трохи." };
    }
  }

  // 2) забагато за вікно
  if (hits.length >= max) {
    return { ok: false, reason: "Перевищено ліміт надсилань. Спробуйте пізніше." };
  }

  // 3) дубль тексту
  if (opts.dupText && opts.dupText.trim().length > 0) {
    const key = ip + ":" + hash(opts.dupText.trim().toLowerCase());
    const prev = recentBodies.get(key);
    if (prev && now - prev < dupWindowMs) {
      return { ok: false, reason: "Таке звернення вже надіслано." };
    }
    recentBodies.set(key, now);
  }

  // фіксуємо успішне надсилання
  hits.push({ t: now });
  ipHits.set(ip, hits);
  return { ok: true };
}

/** Перевірка «пастки» та часу заповнення. true = це бот. */
export function looksLikeBot(body: {
  website?: unknown; // honeypot — має бути порожнім
  _t?: unknown; // час рендеру форми (ms)
}): boolean {
  // honeypot заповнений — точно бот
  if (typeof body.website === "string" && body.website.trim().length > 0) return true;
  // форму надіслано швидше ніж за 2.5 c після відкриття — підозріло
  const t = Number(body._t);
  if (Number.isFinite(t) && t > 0) {
    const elapsed = Date.now() - t;
    if (elapsed < 2500) return true;
  }
  return false;
}
