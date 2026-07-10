import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { IconLock } from "@/components/icons";

export const metadata: Metadata = {
  title: "Політика конфіденційності — ГУНП м. Київ",
  description: "Як проєкт «НАШЕ Київ» обробляє дані, надіслані через форми заявки та скарги.",
};

const sections: { h: string; p: string[] }[] = [
  {
    h: "1. Загальні положення",
    p: [
      "«НАШЕ Київ» — це рольовий (RolePlay) ігровий проєкт у середовищі Roblox, що імітує роботу Головного управління Національної поліції України в місті Києві. Проєкт не є державним органом і не має жодного стосунку до реальної Національної поліції України.",
      "Ця політика пояснює, які дані ми збираємо через форми на сайті та як їх використовуємо винятково в межах ігрової спільноти.",
    ],
  },
  {
    h: "2. Які дані ми збираємо",
    p: [
      "Через форму заявки: ігрове імʼя та прізвище, Discord-нік, вік, посилання Steam, часовий пояс, відповіді на анкетні запитання.",
      "Через форму скарги: ваш Discord-нік, ігровий нікнейм, дані про особу, на яку подано скаргу, опис ситуації та посилання на докази.",
      "Ми не збираємо паспортних даних, номерів телефонів, платіжної інформації чи інших реальних персональних даних і просимо їх не вказувати.",
    ],
  },
  {
    h: "3. Як використовуються дані",
    p: [
      "Надіслані форми зберігаються у внутрішній базі проєкту та дублюються в закритий канал Discord управління для розгляду адміністрацією.",
      "Дані використовуються лише для обробки заявок на вступ і скарг у межах ігрового процесу та не передаються третім сторонам поза спільнотою проєкту.",
    ],
  },
  {
    h: "4. Зберігання та видалення",
    p: [
      "Дані зберігаються протягом часу, необхідного для розгляду звернення та ведення ігрового обліку.",
      "Ви можете попросити видалити ваше звернення, звернувшись до адміністрації через офіційний Discord-сервер проєкту.",
    ],
  },
  {
    h: "5. Cookie та адмін-панель",
    p: [
      "Сайт використовує технічний cookie лише для авторизації адміністратора в панелі керування. Жодного стеження за відвідувачами чи рекламних cookie немає.",
    ],
  },
  {
    h: "6. Контакти",
    p: [
      "З усіх питань щодо цієї політики звертайтеся до адміністрації через Discord-сервер проєкту, посилання на який розміщене у нижній частині сайту.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <main className="pt-[68px]">
        <header className="relative overflow-hidden border-b border-navy-900/10 bg-navy-950 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 25%, rgba(74,124,214,0.5), transparent 50%)",
            }}
          />
          <div className="container-x relative py-16 sm:py-20">
            <nav className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ice/60">
              <Link href="/" className="transition hover:text-white">
                Головна
              </Link>
              <span className="text-ice/30">/</span>
              <span className="text-signal">Конфіденційність</span>
            </nav>
            <span className="eyebrow text-signal/90">
              <IconLock width={13} height={13} /> Правова інформація
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-5xl">
              Політика конфіденційності
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ice/75">
              Останнє оновлення: 2026 рік
            </p>
          </div>
        </header>

        <section className="bg-ice py-14 sm:py-20">
          <div className="container-x max-w-3xl">
            <div className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-card sm:p-10">
              <div className="space-y-9">
                {sections.map((s) => (
                  <div key={s.h}>
                    <h2 className="font-head text-lg font-semibold text-navy-900 sm:text-xl">
                      {s.h}
                    </h2>
                    <div className="mt-3 space-y-3">
                      {s.p.map((para, i) => (
                        <p key={i} className="text-[15px] leading-relaxed text-navy-800/85">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 rounded-xl border border-signal/40 bg-signal/10 px-5 py-4 text-sm text-navy-800">
                Проєкт має виключно розважальний характер. Усі згадки про державні органи, посади та
                символіку використовуються в межах рольової гри.
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
