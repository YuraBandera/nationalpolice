import { promises as fs } from "fs";
import path from "path";
import type { Database } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

function uid() {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
}

function seed(): Database {
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 864e5).toISOString();
  return {
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

let writing: Promise<void> = Promise.resolve();

async function ensure(): Promise<Database> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw) as Database;
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const data = seed();
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
    return data;
  }
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
    const tmp = DB_PATH + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
    await fs.rename(tmp, DB_PATH);
  });
  await writing;
  return result;
}

export { uid };
