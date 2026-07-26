"use client";

import { statusLabel } from "@/lib/kkArticles";

export interface StatementDoc {
  number?: string;
  articles?: { code: string; title: string; punishment?: string }[];
  status?: string;
  court?: string;
  applicant?: string;
  fullName?: string;
  suspect?: string;
  eventDate?: string;
  eventPlace?: string;
  fabula?: string;
  witnesses?: string;
  evidence?: string;
  applicantSignature?: string;
  signature?: string;
  createdAt?: string;
  official?: boolean; // показати шапку витягу з ЄРДР
}

function d(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function StatementDocument(props: StatementDoc) {
  const {
    number,
    articles,
    status,
    court,
    applicant,
    fullName,
    eventDate,
    eventPlace,
    fabula,
    witnesses,
    evidence,
    applicantSignature,
    signature,
    createdAt,
    official,
  } = props;

  return (
    <div className="erdr-doc mx-auto max-w-[820px] bg-white px-8 py-10 text-[15px] leading-relaxed text-black shadow-card sm:px-16 sm:py-14">
      {official && number && (
        <div className="mb-8 border-b-2 border-black/80 pb-3 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/60">
            Єдиний реєстр досудових розслідувань
          </p>
          <p className="mt-1 font-mono text-lg font-bold">№ {number}</p>
          {status && <p className="mt-0.5 text-[13px] text-black/60">Стан: {statusLabel(status)}</p>}
        </div>
      )}

      {/* До / Від */}
      <div className="mb-8 space-y-3">
        <div>
          <p className="font-bold">До:</p>
          <p>{court || "Головного слідчого управління ГУНП у м. Києві"}</p>
        </div>
        <div>
          <p className="font-bold">Від:</p>
          <p>{fullName ? `${fullName}` : ""}{applicant ? `${fullName ? ", " : ""}@${applicant}` : ""}</p>
        </div>
      </div>

      {/* Заголовок */}
      <div className="mb-7 text-center">
        <h1 className="text-xl font-bold tracking-wide">ЗАЯВА</h1>
        <p className="mt-0.5 text-[13.5px]">про вчинення кримінального правопорушення</p>
      </div>

      {/* Тіло */}
      <div className="space-y-4 text-justify">
        <p>
          Я{fullName ? `, ${fullName},` : ""} повідомляю про вчинення кримінального правопорушення.
        </p>

        {(eventDate || eventPlace) && (
          <p>
            {eventDate ? `${eventDate} ` : ""}
            {eventPlace ? `за адресою: ${eventPlace} ` : ""}
            сталася подія, яка, на мою думку, містить ознаки кримінального правопорушення.
          </p>
        )}

        {fabula && (
          <div>
            <p className="font-semibold">Обставини події:</p>
            <p className="mt-1 whitespace-pre-wrap">{fabula}</p>
          </div>
        )}

        {witnesses && <p>Свідки: {witnesses}</p>}

        <p>
          Вважаю, що у зазначених діях можуть міститися ознаки кримінального правопорушення,
          передбаченого Кримінальним кодексом України
          {articles && articles.length > 0
            ? ` (${articles.map((a) => `ст. ${a.code}`).join(", ")})`
            : ""}
          .
        </p>

        {evidence && (
          <p>
            Докази:{" "}
            {/^https?:\/\//.test(evidence) ? (
              <a href={evidence} target="_blank" rel="noreferrer" className="text-blue-700 underline">
                доказ
              </a>
            ) : (
              evidence
            )}
          </p>
        )}

        <div>
          <p className="font-bold">Прошу:</p>
          <ol className="mt-1 list-decimal space-y-1 pl-6">
            <li>Прийняти та зареєструвати цю заяву.</li>
            <li>Провести повне, всебічне та об'єктивне досудове розслідування.</li>
            <li>
              Встановити особу, яка вчинила кримінальне правопорушення, та притягнути її до
              відповідальності згідно із законом.
            </li>
          </ol>
        </div>
      </div>

      {/* Підпис */}
      <div className="mt-10 flex items-end justify-between gap-6">
        <p className="font-semibold">
          Дата: {d(createdAt) || "____________"} року
        </p>
        <div className="text-right">
          <div className="flex items-end justify-end gap-2">
            <span className="font-semibold">Підпис заявника:</span>
            {applicantSignature ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={applicantSignature} alt="Підпис" className="h-12 w-40 object-contain" />
            ) : (
              <span className="inline-block w-40 border-b border-black/50" />
            )}
          </div>
        </div>
      </div>

      {/* Підпис слідчого (для витягу) */}
      {official && signature && (
        <div className="mt-8 flex items-end justify-end gap-2 border-t border-black/15 pt-6">
          <span className="font-semibold">Слідчий:</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={signature} alt="Підпис слідчого" className="h-12 w-40 object-contain" />
        </div>
      )}
    </div>
  );
}
