import { promises as fs } from "fs";
import path from "path";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import type { Database, SiteSettings } from "./types";

/**
 * Сховище даних.
 * - Якщо задані змінні R2_* → база зберігається у Cloudflare R2 (один об'єкт db.json).
 *   Це переживає перезапуски Railway, тож зміни в адмінці зберігаються назавжди.
 * - Якщо змінних немає (локальна розробка) → база у файлі data/db.json.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

const R2_KEY = process.env.R2_DB_KEY || "db.json";
const useR2 = Boolean(
  process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET
);

let s3: S3Client | null = null;
function r2(): S3Client {
  if (!s3) {
    s3 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
      },
    });
  }
  return s3;
}

function uid() {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
}

function defaultSettings(): SiteSettings {
  return {
    recruitmentOpen: true,
    recruitmentClosedTitle: "Набір тимчасово закрито",
    recruitmentClosedMessage:
      "Наразі ми не приймаємо нові заявки. Стеж за оголошеннями в нашому Discord — щойно набір відкриється, ти зможеш подати анкету тут.",
  };
}

function seed(): Database {
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 864e5).toISOString();
  return {
    settings: defaultSettings(),
    units: [
      {
        id: uid(),
        name: "Управління патрульної поліції",
        short: "Порядок на вулицях міста",
        description:
          "Забезпечує охорону громадського порядку, реагує на виклики, контролює безпеку дорожнього руху та першою прибуває на місце подій. Обличчя поліції для мешканців Києва.",
        icon: "car",
        order: 1,
      },
      {
        id: uid(),
        name: "Кримінальна поліція",
        short: "Розкриття злочинів",
        description:
          "Веде оперативно-розшукову діяльність, виявляє та розкриває тяжкі й особливо тяжкі злочини, працює з агентурою та документує протиправну діяльність.",
        icon: "search",
        order: 2,
      },
      {
        id: uid(),
        name: "Слідче управління",
        short: "Досудове розслідування",
        description:
          "Здійснює досудове розслідування кримінальних проваджень, збирає доказову базу, взаємодіє з прокуратурою та передає справи до суду.",
        icon: "file",
        order: 3,
      },
      {
        id: uid(),
        name: "КОРД",
        short: "Корпус оперативно-раптової дії",
        description:
          "Елітний спецпідрозділ. Затримання озброєних злочинців, звільнення заручників, силова підтримка операцій підвищеної складності.",
        icon: "target",
        order: 4,
      },
      {
        id: uid(),
        name: "Поліція особливого призначення",
        short: "Масові заходи та посилення",
        description:
          "Забезпечує порядок під час масових заходів, охороняє важливі об'єкти та підсилює інші підрозділи в складних ситуаціях.",
        icon: "shield",
        order: 5,
      },
      {
        id: uid(),
        name: "Кіберполіція",
        short: "Протидія кіберзлочинності",
        description:
          "Розслідує злочини у цифровому середовищі: шахрайство, витоки даних, протиправний контент. Проводить профілактику серед громадян.",
        icon: "cpu",
        order: 6,
      },
      {
        id: uid(),
        name: "Чергова частина",
        short: "Координація 24/7",
        description:
          "Цілодобовий центр управління силами й засобами. Приймає виклики, розподіляє екіпажі та контролює оперативну обстановку в місті.",
        icon: "radio",
        order: 7,
      },
    ],
    applicationQuestions: [
      { id: uid(), label: "Steam", type: "short", required: false },
      { id: uid(), label: "Часовий пояс", type: "short", required: false },
      { id: uid(), label: "Досвід RolePlay", type: "long", required: false },
      { id: uid(), label: "Чому хочете вступити?", type: "long", required: true },
      { id: uid(), label: "Чому саме ГУНП?", type: "long", required: false },
      { id: uid(), label: "Чи були покарання?", type: "short", required: false },
      { id: uid(), label: "Додаткова інформація", type: "short", required: false },
    ],
    stats: [
      { id: uid(), label: "Працівників", value: 248, suffix: "" },
      { id: uid(), label: "Патрулів на зміні", value: 32, suffix: "" },
      { id: uid(), label: "Виконаних викликів", value: 14750, suffix: "+" },
      { id: uid(), label: "Відкритих вакансій", value: 12, suffix: "" },
    ],
    leadership: [
      {
        id: uid(),
        name: "Олександр Ткаченко",
        rank: "Начальник ГУНП м. Київ",
        photo: "",
        bio: "Керує роботою управління, координує підрозділи та відповідає за загальну стратегію охорони правопорядку в місті.",
        order: 1,
      },
      {
        id: uid(),
        name: "Ірина Коваленко",
        rank: "Перший заступник начальника",
        photo: "",
        bio: "Курує оперативний блок та взаємодію між кримінальною і патрульною поліцією.",
        order: 2,
      },
      {
        id: uid(),
        name: "Дмитро Савченко",
        rank: "Заступник — начальник слідчого управління",
        photo: "",
        bio: "Відповідає за досудове розслідування та якість слідчої роботи в управлінні.",
        order: 3,
      },
      {
        id: uid(),
        name: "Марина Бондар",
        rank: "Начальник управління кадрового забезпечення",
        photo: "",
        bio: "Опрацьовує заявки кандидатів, організовує навчання та атестацію особового складу.",
        order: 4,
      },
    ],
    news: [
      {
        id: uid(),
        title: "Патрульна поліція підбила підсумки тижня",
        date: daysAgo(1),
        author: "Пресслужба ГУНП",
        image: "",
        excerpt:
          "За минулий тиждень екіпажі відпрацювали понад 300 викликів та забезпечили порядок на масових заходах.",
        body: "За минулий тиждень екіпажі патрульної поліції відпрацювали понад 300 викликів. Особлива увага приділялася безпеці дорожнього руху та охороні громадського порядку під час масових заходів у центрі міста.\n\nНачальник управління подякував особовому складу за витримку й професіоналізм. Робота триває в посиленому режимі.",
        likes: 0,
        dislikes: 0,
        createdAt: daysAgo(1),
      },
      {
        id: uid(),
        title: "Оголошено набір до лав ГУНП м. Київ",
        date: daysAgo(3),
        author: "Відділ кадрів",
        image: "",
        excerpt:
          "Управління відкриває набір нових співробітників. Подати заявку можна безпосередньо на сайті.",
        body: "Головне управління оголошує набір кандидатів на службу. Ми шукаємо відповідальних та вмотивованих гравців, готових дотримуватися правил рольової гри та статуту.\n\nЩоб приєднатися, заповніть форму «Подати заявку». Після розгляду з вами зв'яжуться у Discord.",
        likes: 0,
        dislikes: 0,
        createdAt: daysAgo(3),
      },
      {
        id: uid(),
        title: "Кіберполіція провела профілактичний рейд",
        date: daysAgo(6),
        author: "Пресслужба ГУНП",
        image: "",
        excerpt:
          "Спеціалісти кіберполіції відпрацювали звернення громадян щодо шахрайства в мережі.",
        body: "Підрозділ кіберполіції провів планову роботу за зверненнями громадян. Відпрацьовано низку випадків онлайн-шахрайства, надано рекомендації щодо цифрової безпеки.\n\nНагадуємо: не передавайте дані карток стороннім особам.",
        likes: 0,
        dislikes: 0,
        createdAt: daysAgo(6),
      },
    ],
    gallery: [
      { id: uid(), type: "image", src: "", caption: "Ранковий розвід особового складу", createdAt: daysAgo(2) },
      { id: uid(), type: "image", src: "", caption: "Патрулювання центру Києва", createdAt: daysAgo(4) },
      { id: uid(), type: "image", src: "", caption: "Робота слідчо-оперативної групи", createdAt: daysAgo(5) },
      { id: uid(), type: "image", src: "", caption: "Спецпідрозділ КОРД на навчаннях", createdAt: daysAgo(7) },
      { id: uid(), type: "image", src: "", caption: "Чергова частина управління", createdAt: daysAgo(8) },
      { id: uid(), type: "image", src: "", caption: "Урочисте шикування", createdAt: daysAgo(9) },
    ],
    contacts: {
      discord: process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/N9gFDMs9v",
      robloxUrl: "https://www.roblox.com/",
      email: "info@nashe-kyiv.example",
      hours: "Цілодобово • Чергова частина 24/7",
      socials: [
        { label: "Discord", url: process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/N9gFDMs9v" },
        { label: "YouTube", url: "https://youtube.com/" },
        { label: "TikTok", url: "https://tiktok.com/" },
      ],
    },
    applications: [],
    complaints: [],
  };
}

/** Дозаповнює відсутні поля у вже наявній базі (міграція старих даних). */
function normalize(db: Partial<Database>): Database {
  const base = seed();
  return {
    settings: { ...base.settings, ...(db.settings || {}) },
    units: db.units ?? base.units,
    applicationQuestions: db.applicationQuestions ?? base.applicationQuestions,
    stats: db.stats ?? base.stats,
    leadership: db.leadership ?? base.leadership,
    news: (db.news ?? base.news).map((n) => ({
      ...n,
      likes: n.likes ?? 0,
      dislikes: n.dislikes ?? 0,
    })),
    gallery: db.gallery ?? base.gallery,
    contacts: { ...base.contacts, ...(db.contacts || {}) },
    applications: db.applications ?? [],
    complaints: db.complaints ?? [],
  };
}

let cache: Database | null = null;
let writing: Promise<void> = Promise.resolve();

async function streamToString(body: unknown): Promise<string> {
  // AWS SDK v3 Node.js: Body має transformToString()
  const b = body as { transformToString?: () => Promise<string> };
  if (b && typeof b.transformToString === "function") return b.transformToString();
  // запасний шлях
  const chunks: Buffer[] = [];
  for await (const chunk of body as AsyncIterable<Buffer>) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

async function loadR2(): Promise<Database | null> {
  try {
    const res = await r2().send(
      new GetObjectCommand({ Bucket: process.env.R2_BUCKET as string, Key: R2_KEY })
    );
    const text = await streamToString(res.Body);
    return normalize(JSON.parse(text));
  } catch (e: unknown) {
    const err = e as { name?: string; $metadata?: { httpStatusCode?: number } };
    if (err?.name === "NoSuchKey" || err?.$metadata?.httpStatusCode === 404) return null;
    throw e;
  }
}

async function saveR2(db: Database): Promise<void> {
  await r2().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET as string,
      Key: R2_KEY,
      Body: JSON.stringify(db, null, 2),
      ContentType: "application/json",
    })
  );
}

async function loadFile(): Promise<Database> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return normalize(JSON.parse(raw));
  } catch {
    const data = normalize(seed());
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
    return data;
  }
}

async function saveFile(db: Database): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = DB_PATH + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DB_PATH);
}

async function ensure(): Promise<Database> {
  if (cache) return cache;
  if (useR2) {
    let db = await loadR2();
    if (!db) {
      db = normalize(seed());
      await saveR2(db);
    }
    cache = db;
  } else {
    cache = await loadFile();
  }
  return cache;
}

export async function readDb(): Promise<Database> {
  return ensure();
}

/** Серіалізований read-modify-write, щоб уникнути гонок. */
export async function mutate<T>(fn: (db: Database) => T | Promise<T>): Promise<T> {
  let result!: T;
  writing = writing.then(async () => {
    const db = await ensure();
    result = await fn(db);
    if (useR2) await saveR2(db);
    else await saveFile(db);
    cache = db;
  });
  await writing;
  return result;
}

export { uid };
