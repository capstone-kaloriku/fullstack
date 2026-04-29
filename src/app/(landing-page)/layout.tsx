import type { Metadata } from "next";
import "@/app/globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "KaloriKU",
  description:
    "Aplikasi untuk menghitung kalori makanan dan aktivitas fisik, membantu pengguna mencapai tujuan kesehatan mereka dengan mudah dan akurat. Biar gak gendutt wokk",
};

export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className={`min-h-full flex flex-col`}>
      <Header />
      {children}
    </section>
  );
}
