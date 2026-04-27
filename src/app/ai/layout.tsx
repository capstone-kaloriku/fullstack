import type { Metadata } from "next";
import "../globals.css";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export const metadata: Metadata = {
  title: "AI - KaloriKu",
  description:
    "Halaman AI di KaloriKu memungkinkan pengguna untuk mendapatkan saran dan rekomendasi berdasarkan data kesehatan mereka.",
};

export default function AI({ children }: { children: React.ReactNode }) {
  return (
    <section className={`h-screen overflow-y-auto`}>
      <DashboardSidebar>
        {children}
      </DashboardSidebar>
    </section>
  );
}
