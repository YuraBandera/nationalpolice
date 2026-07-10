export interface NewsItem {
  id: string;
  title: string;
  date: string; // ISO
  author: string;
  image: string;
  excerpt: string;
  body: string;
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

export interface Application {
  id: string;
  firstName: string;
  lastName: string;
  discord: string;
  age: string;
  steam: string;
  timezone: string;
  rpExperience: string;
  whyJoin: string;
  whyGunp: string;
  punishments: string;
  extra: string;
  status: "new" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
}

export interface Complaint {
  id: string;
  discord: string;
  nickname: string;
  against: string;
  unit: string;
  date: string;
  description: string;
  evidence: string;
  status: "new" | "reviewed" | "resolved";
  createdAt: string;
}

export interface Database {
  news: NewsItem[];
  gallery: GalleryItem[];
  leadership: Leader[];
  stats: StatItem[];
  contacts: Contacts;
  applications: Application[];
  complaints: Complaint[];
}
