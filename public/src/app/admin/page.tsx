import { AdminApp } from "@/components/admin/AdminApp";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Панель керування — ГУНП м. Київ",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
