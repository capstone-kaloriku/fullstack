import type { Metadata } from "next";
import "@/app/globals.css";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "KaloriKU",
  description:
    "Aplikasi untuk membantu Anda menghitung kalori makanan dengan mudah dan cepat. Cukup masukkan nama makanan atau jumlah kalori yang ingin Anda ketahui, dan KaloriKU akan memberikan informasi yang akurat dan terpercaya. Dengan KaloriKU, Anda dapat mengelola asupan kalori harian Anda dengan lebih baik dan mencapai tujuan kesehatan Anda dengan lebih efektif.",
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
      <Footer />
    </section>
  );
}
