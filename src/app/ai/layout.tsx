import type { Metadata } from "next";
import "../globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "AI - KaloriKu",
  description:
    "Halaman AI di KaloriKu memungkinkan pengguna untuk mendapatkan saran dan rekomendasi berdasarkan data kesehatan mereka.",
};

export default function AI({ children }: { children: React.ReactNode }) {
  return (
    <section className={`min-h-full flex flex-col py-12 overflow-hidden`}>
      <Header />
      {children}
    </section>
  );
}
