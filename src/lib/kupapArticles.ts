// Статті КУпАП (за зводом законів сервера «НАШЕ КИЇВ»).
// Використовуються у заявах про адміністративні правопорушення.

export interface KupapArticle {
  code: string;
  title: string;
  punishment: string;
  transport?: boolean; // стосується транспорту (для швидкого фільтра)
}

export const KUPAP_ARTICLES: KupapArticle[] = [
  { code: "4.1", title: "Дрібне викрадення чужого майна", punishment: "штраф 25 000–45 000 грн або арешт до 15 хв" },

  { code: "5.1", title: "Порушення вимог щодо номерних знаків ТЗ", punishment: "штраф 14 500 грн", transport: true },
  { code: "5.2", title: "Перевищення швидкості, проїзд на заборонний сигнал, інші порушення ПДР", punishment: "штраф 8 900–13 500 грн", transport: true },
  { code: "5.3", title: "Невиконання вимог поліцейського про зупинку", punishment: "штраф 12 000 грн, повторно — арешт до 5–15 хв", transport: true },
  { code: "5.4", title: "Залишення місця ДТП", punishment: "штраф 30 000 грн", transport: true },
  { code: "5.5", title: "Порушення ПДР з пошкодженням майна", punishment: "штраф 46 000 грн", transport: true },
  { code: "5.6", title: "Керування без документів / без права керування", punishment: "штраф 13 200–14 400 грн або позбавлення права", transport: true },
  { code: "5.7", title: "Порушення ПДР пішоходами / велосипедистами", punishment: "штраф 3 700 грн", transport: true },
  { code: "5.8", title: "Порушення правил експлуатації ТЗ (несправності, тонування)", punishment: "штраф 15 700 грн", transport: true },
  { code: "5.9", title: "Незаконне встановлення спецсигналів", punishment: "штраф 45 700 грн та/або арешт 25 хв", transport: true },
  { code: "5.10", title: "Керування без увімкнених фар", punishment: "штраф 12 000 грн", transport: true },
  { code: "5.11", title: "Керування без номерних знаків / незаконні номери", punishment: "штраф 16 000 грн", transport: true },

  { code: "6.1¹", title: "Образа честі та гідності особи", punishment: "штраф 3 900 грн" },
  { code: "6.1²", title: "Образа честі та гідності працівника поліції", punishment: "штраф 8 900 грн або арешт 5 хв" },
  { code: "7.1", title: "Носіння військової/поліцейської форми без права", punishment: "попередження / штраф 9 800 грн / арешт 15 хв" },
  { code: "7.2", title: "Злісна непокора законній вимозі поліцейського", punishment: "арешт до 10 хв" },
];

export function kupapTitle(code: string): string {
  return KUPAP_ARTICLES.find((a) => a.code === code)?.title || "";
}
export function kupapPunishment(code: string): string {
  return KUPAP_ARTICLES.find((a) => a.code === code)?.punishment || "";
}
