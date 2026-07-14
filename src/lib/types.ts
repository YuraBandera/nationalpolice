export interface NewsItem {
  id: string;
  title: string;
  date: string; // ISO
  author: string;
  image: string;
  excerpt: string;
  body: string;
  likes: number;
  dislikes: number;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  caption: string;
  createdAt: string;
}

export interface Leader {
  id: string;
  name: string;
  rank: string; // посада
  photo: string;
  bio: string;
  order: number;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
}

export interface Contacts {
  discord: string;
  robloxUrl: string;
  email: string;
  hours: string;
  socials: { label: string; url: string }[];
}

/** Підрозділ (керується з адмінки) */
export interface Unit {
  id: string;
  name: string;
  short: string;
  description: string;
  icon: string; // ключ іконки, див. UNIT_ICONS
  order: number;
}

/** Питання анкети (керується з адмінки) */
export interface ApplicationQuestion {
  id: string;
  label: string;
  type: "short" | "long";
  required: boolean;
}

/** Відповідь на питання анкети */
export interface ApplicationAnswer {
  questionId: string;
  label: string;
  value: string;
}

export interface Application {
  id: string;
  firstName: string;
  lastName: string;
  discord: string;
  age: string;
  answers?: ApplicationAnswer[];
  // застарілі поля — лишаються для сумісності зі старими заявками:
  steam?: string;
  timezone?: string;
  rpExperience?: string;
  whyJoin?: string;
  whyGunp?: string;
  punishments?: string;
  extra?: string;
  status: "new" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
}

export interface Complaint {
  id: string;
  discord: string;
  nickname: string;
  robloxSelf?: string;
  robloxTarget?: string;
  against: string;
  unit: string;
  date: string;
  description: string;
  evidence: string;
  status: "new" | "reviewed" | "resolved";
  createdAt: string;
}

export interface SiteSettings {
  recruitmentOpen: boolean;
  recruitmentClosedTitle: string;
  recruitmentClosedMessage: string;
}

export interface Database {
  settings: SiteSettings;
  units: Unit[];
  applicationQuestions: ApplicationQuestion[];
  news: NewsItem[];
  gallery: GalleryItem[];
  leadership: Leader[];
  stats: StatItem[];
  contacts: Contacts;
  applications: Application[];
  complaints: Complaint[];
}
