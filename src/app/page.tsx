import { readDb } from "@/lib/db";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Leadership } from "@/components/Leadership";
import { Units } from "@/components/Units";
import { NewsSection } from "@/components/NewsSection";
import { Gallery } from "@/components/Gallery";
import { Contacts } from "@/components/Contacts";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const db = await readDb();
  const leaders = [...db.leadership].sort((a, b) => a.order - b.order);
  const news = [...db.news].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const gallery = [...db.gallery].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <main>
      <Hero />
      <About stats={db.stats} />
      <Leadership leaders={leaders} />
      <Units units={db.units} />
      <NewsSection news={news} />
      <Gallery items={gallery} />
      <Contacts contacts={db.contacts} />
      <Footer />
    </main>
  );
}
