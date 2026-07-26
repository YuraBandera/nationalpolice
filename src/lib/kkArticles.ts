// Статті Кримінального кодексу (за зводом законів сервера «НАШЕ КИЇВ»).
// Використовуються у ЄРДР для реєстрації проваджень.

export interface KkArticle {
  code: string;
  title: string;
  section: string;
  punishment: string;
}

export const KK_ARTICLES: KkArticle[] = [
  { code: "3.1", title: "Дії проти конституційного ладу", section: "Проти основ нацбезпеки", punishment: "80–85 хв позбавлення волі" },
  { code: "3.2", title: "Державна зрада", section: "Проти основ нацбезпеки", punishment: "довічне ув'язнення" },
  { code: "3.3", title: "Посягання на життя державного чи громадського діяча", section: "Проти основ нацбезпеки", punishment: "90–120 хв або довічне" },
  { code: "3.4", title: "Диверсія", section: "Проти основ нацбезпеки", punishment: "85–95 хв або довічне" },
  { code: "3.5", title: "Шпигунство", section: "Проти основ нацбезпеки", punishment: "до 80 хв" },

  { code: "4.1", title: "Умисне вбивство", section: "Проти життя та здоров'я", punishment: "до 25 хв" },
  { code: "4.2", title: "Умисне вбивство при перевищенні меж оборони", section: "Проти життя та здоров'я", punishment: "до 20 хв" },
  { code: "4.3", title: "Вбивство через необережність", section: "Проти життя та здоров'я", punishment: "15 хв (одна особа) / 20 хв (двоє і більше)" },
  { code: "4.4", title: "Умисне тяжке тілесне ушкодження", section: "Проти життя та здоров'я", punishment: "до 30 хв" },
  { code: "4.5", title: "Умисне легке тілесне ушкодження", section: "Проти життя та здоров'я", punishment: "штраф до 20 000 грн або обмеження волі до 5 хв" },
  { code: "4.6", title: "Погроза вбивством", section: "Проти життя та здоров'я", punishment: "до 6 хв" },
  { code: "4.7", title: "Злочин проти працівника ЕМД, лікаря, ДСНС", section: "Проти життя та здоров'я", punishment: "10–27 хв залежно від тяжкості" },

  { code: "5.1", title: "Наруга над державними символами", section: "Проти авторитету влади", punishment: "штраф 30 000 грн або до 40 хв" },
  { code: "5.2", title: "Захоплення державних або громадських будівель", section: "Проти авторитету влади", punishment: "до 25 хв" },
  { code: "5.3", title: "Опір представникові влади / працівникові поліції", section: "Проти авторитету влади", punishment: "штраф 15 000 грн – до 15 хв" },
  { code: "5.4", title: "Втручання в діяльність працівника правоохоронного органу", section: "Проти авторитету влади", punishment: "до 10 хв" },
  { code: "5.5", title: "Погроза або насильство щодо працівника поліції", section: "Проти авторитету влади", punishment: "до 10 хв" },
  { code: "5.6", title: "Підроблення документів, печаток, штампів", section: "Проти авторитету влади", punishment: "штраф до 30 000 грн та/або до 13 хв" },
  { code: "5.7", title: "Перевищення влади працівником правоохоронного органу", section: "Проти авторитету влади", punishment: "обмеження волі до 20 хв + заборона обіймати посади" },

  { code: "6.1", title: "Масові заворушення", section: "Проти громадського порядку", punishment: "до 25 хв" },
  { code: "6.2", title: "Хуліганство", section: "Проти громадського порядку", punishment: "штраф до 12 900 грн або до 10 хв (групою)" },

  { code: "7.1", title: "Крадіжка", section: "Проти власності", punishment: "штраф 40 000 грн та/або до 15 хв" },
  { code: "7.2", title: "Грабіж", section: "Проти власності", punishment: "до 25 хв" },
  { code: "7.3", title: "Розбій", section: "Проти власності", punishment: "до 22 хв" },
  { code: "7.4", title: "Шахрайство", section: "Проти власності", punishment: "до 22 хв з конфіскацією" },

  { code: "8.1", title: "Створення / участь у злочинній організації", section: "Проти громадської безпеки", punishment: "керівництво до 30 хв / участь до 15 хв" },
  { code: "8.2", title: "Встановлення або поширення злочинного впливу", section: "Проти громадської безпеки", punishment: "довічне ув'язнення" },
  { code: "8.3", title: "Терористичний акт", section: "Проти громадської безпеки", punishment: "до 60 хв з конфіскацією" },
  { code: "8.4", title: "Незаконне поводження зі зброєю", section: "Проти громадської безпеки", punishment: "вогнепальна — до 15 хв / холодна — штраф 23 000 грн або до 10 хв" },

  { code: "9.1", title: "Зґвалтування", section: "Проти статевої свободи", punishment: "до 40 хв залежно від обставин" },
  { code: "9.2", title: "Розбещення неповнолітніх", section: "Проти статевої свободи", punishment: "до 35 хв" },

  { code: "10.1", title: "Непокора", section: "Військові правопорушення", punishment: "до 40 хв" },
  { code: "10.2", title: "Самовільне залишення військової частини", section: "Військові правопорушення", punishment: "штраф 80 000 грн та 40 хв волі" },
];

export function articleTitle(code: string): string {
  return KK_ARTICLES.find((a) => a.code === code)?.title || "";
}
export function articlePunishment(code: string): string {
  return KK_ARTICLES.find((a) => a.code === code)?.punishment || "";
}

export const ERDR_STATUSES: { key: string; label: string; color: string }[] = [
  { key: "registered", label: "Зареєстровано", color: "#3B82F6" },
  { key: "investigating", label: "Розслідується", color: "#F59E0B" },
  { key: "suspended", label: "Зупинено", color: "#6B7280" },
  { key: "court", label: "Скеровано до суду", color: "#8B5CF6" },
  { key: "closed", label: "Закрито", color: "#10B981" },
];

export function statusLabel(key: string): string {
  return ERDR_STATUSES.find((s) => s.key === key)?.label || key;
}
export function statusColor(key: string): string {
  return ERDR_STATUSES.find((s) => s.key === key)?.color || "#6B7280";
}
