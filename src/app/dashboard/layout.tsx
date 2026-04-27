import type { Metadata } from "next";
import "../globals.css";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export const metadata: Metadata = {
  title: "Dashboard - KaloriKu",
  description:
    "Halaman Dashboard di KaloriKu memungkinkan pengguna untuk melihat riwayat aktivitas mereka, termasuk catatan makanan, olahraga, dan berat badan. Dengan tampilan yang mudah dipahami, pengguna dapat melacak kemajuan mereka dalam mencapai tujuan kesehatan dan kebugaran mereka.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <section className={`h-screen overflow-y-auto`}>
      <DashboardSidebar>
        {children}
      </DashboardSidebar>
    </section>
  );
}
