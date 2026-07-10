import type { ImgHTMLAttributes } from "react";

/**
 * Логотип НПУ. Показує файл /public/npu_logo.png.
 * Використовується всюди: шапка, Hero, прелоадер, футер, адмінка.
 * className задає розмір (напр. "h-16 w-16") — лого вписується без спотворення.
 */
export function Emblem({ className, alt, ...p }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/npu_logo.png"
      alt={alt ?? "Логотип Національної поліції України"}
      className={`object-contain ${className ?? ""}`}
      draggable={false}
      {...p}
    />
  );
}
