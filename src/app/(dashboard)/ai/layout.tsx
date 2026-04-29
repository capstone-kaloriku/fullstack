import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "AI - KaloriKu",
  description: "Halaman AI di KaloriKu memungkinkan pengguna untuk mendapatkan saran dan rekomendasi berdasarkan data kesehatan mereka.",
};

export default function AILayout({
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
