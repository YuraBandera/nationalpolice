import {
  IconCar,
  IconSearch,
  IconFile,
  IconTarget,
  IconShield,
  IconCpu,
  IconRadio,
} from "@/components/icons";
import type { ComponentType, SVGProps } from "react";

export interface Unit {
  slug: string;
  name: string;
  short: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const UNITS: Unit[] = [
  {
    slug: "patrol",
    name: "Управління патрульної поліції",
    short: "Порядок на вулицях міста",
    description:
      "Забезпечує охорону громадського порядку, реагує на виклики, контролює безпеку дорожнього руху та першою прибуває на місце подій. Обличчя поліції для мешканців Києва.",
    Icon: IconCar,
  },
  {
    slug: "criminal",
    name: "Кримінальна поліція",
    short: "Розкриття злочинів",
    description:
      "Веде оперативно-розшукову діяльність, виявляє та розкриває тяжкі й особливо тяжкі злочини, працює з агентурою та документує протиправну діяльність.",
    Icon: IconSearch,
  },
  {
    slug: "investigation",
    name: "Слідче управління",
    short: "Досудове розслідування",
    description:
      "Здійснює досудове розслідування кримінальних проваджень, збирає доказову базу, взаємодіє з прокуратурою та передає справи до суду.",
    Icon: IconFile,
  },
  {
    slug: "kord",
    name: "КОРД",
    short: "Корпус оперативно-раптової дії",
    description:
      "Елітний спецпідрозділ. Затримання озброєних злочинців, звільнення заручників, силова підтримка операцій підвищеної складності.",
    Icon: IconTarget,
  },
  {
    slug: "special",
    name: "Поліція особливого призначення",
    short: "Масові заходи та посилення",
    description:
      "Забезпечує порядок під час масових заходів, охороняє важливі об'єкти та підсилює інші підрозділи в складних ситуаціях.",
    Icon: IconShield,
  },
  {
    slug: "cyber",
    name: "Кіберполіція",
    short: "Протидія кіберзлочинності",
    description:
      "Розслідує злочини у цифровому середовищі: шахрайство, витоки даних, протиправний контент. Проводить профілактику серед громадян.",
    Icon: IconCpu,
  },
  {
    slug: "duty",
    name: "Чергова частина",
    short: "Координація 24/7",
    description:
      "Цілодобовий центр управління силами й засобами. Приймає виклики, розподіляє екіпажі та контролює оперативну обстановку в місті.",
    Icon: IconRadio,
  },
];

export const NAV_LINKS = [
  { href: "/#home", label: "Головна" },
  { href: "/#about", label: "Про управління" },
  { href: "/#leadership", label: "Керівництво" },
  { href: "/#units", label: "Підрозділи" },
  { href: "/#news", label: "Новини" },
  { href: "/#gallery", label: "Галерея" },
  { href: "/#contacts", label: "Контакти" },
];
