import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Logs - KaloriKu",
  description: "Halaman Logs di KaloriKu memungkinkan pengguna untuk melihat riwayat aktivitas mereka, termasuk catatan makanan, olahraga, dan berat badan. Dengan tampilan yang mudah dipahami, pengguna dapat melacak kemajuan mereka dalam mencapai tujuan kesehatan dan kebugaran mereka.",
};

export default function LogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  );
}
