import {
  IconCar,
  IconSearch,
  IconFile,
  IconTarget,
  IconShield,
  IconShieldCheck,
  IconCpu,
  IconRadio,
  IconUsers,
  IconGavel,
  IconPhone,
  IconAlert,
  IconMapPin,
  IconBriefcase,
  IconClock,
} from "@/components/icons";
import type { ComponentType, SVGProps } from "react";

export const UNIT_ICONS: {
  key: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { key: "car", label: "Патруль / авто", Icon: IconCar },
  { key: "search", label: "Розшук", Icon: IconSearch },
  { key: "file", label: "Документи", Icon: IconFile },
  { key: "target", label: "Спецпризначення", Icon: IconTarget },
  { key: "shield", label: "Щит", Icon: IconShield },
  { key: "shieldCheck", label: "Щит (перевірка)", Icon: IconShieldCheck },
  { key: "cpu", label: "Кібер", Icon: IconCpu },
  { key: "radio", label: "Зв'язок", Icon: IconRadio },
  { key: "users", label: "Особовий склад", Icon: IconUsers },
  { key: "gavel", label: "Право", Icon: IconGavel },
  { key: "phone", label: "Телефон", Icon: IconPhone },
  { key: "alert", label: "Тривога", Icon: IconAlert },
  { key: "mapPin", label: "Локація", Icon: IconMapPin },
  { key: "briefcase", label: "Портфель", Icon: IconBriefcase },
  { key: "clock", label: "Час", Icon: IconClock },
];

export function unitIcon(key: string): ComponentType<SVGProps<SVGSVGElement>> {
  return (UNIT_ICONS.find((u) => u.key === key) || UNIT_ICONS[0]).Icon;
}
