import Link from "next/link";
import { Emblem } from "./Emblem";
import { IconDiscord } from "./icons";

const DISCORD = process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/N9gFDMs9v";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950 text-white">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Emblem className="h-10 w-10" />
              <div>
                <div className="font-head text-[15px] font-bold">ГУНП м. Київ</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">НАШЕ Київ</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/55">
              Головне управління Національної поліції України в місті Києві. Рольовий проєкт у Roblox.
              Служимо та захищаємо.
            </p>
            <a
              href={DISCORD}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-[13px] text-white/80 transition hover:border-navy-400/40 hover:text-white"
            >
              <IconDiscord width={18} height={18} /> Discord-сервер
            </a>
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-steel">Навігація</div>
            <ul className="mt-4 space-y-2.5 text-[14px] text-white/70">
              <li><Link href="/#about" className="transition hover:text-white">Про управління</Link></li>
              <li><Link href="/#units" className="transition hover:text-white">Підрозділи</Link></li>
              <li><Link href="/news" className="transition hover:text-white">Новини</Link></li>
              <li><Link href="/#gallery" className="transition hover:text-white">Галерея</Link></li>
              <li><Link href="/#contacts" className="transition hover:text-white">Контакти</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-steel">Сервіси</div>
            <ul className="mt-4 space-y-2.5 text-[14px] text-white/70">
              <li><Link href="/apply" className="transition hover:text-white">Подати заявку</Link></li>
              <li><Link href="/complaint" className="transition hover:text-white">Подати скаргу</Link></li>
              <li><Link href="/admin" className="transition hover:text-white">Адмін-панель</Link></li>
              <li><Link href="/privacy" className="transition hover:text-white">Політика конфіденційності</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-[12.5px] text-white/45 sm:flex-row sm:items-center">
          <span>© 2026 НАШЕ Київ. Усі права захищені.</span>
          <span className="font-mono uppercase tracking-wide">Рольовий проєкт • не є державним сайтом</span>
        </div>
      </div>
    </footer>
  );
}
