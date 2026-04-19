import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plusJakarataSans",
  weight: ["600", "700", "800"],
  subsets: ["latin"],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-beVietnamPro",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KaloriKU",
  description:
    "Aplikasi untuk menghitung kalori makanan dan aktivitas fisik, membantu pengguna mencapai tujuan kesehatan mereka dengan mudah dan akurat. Biar gak gendutt wokk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        plusJakartaSans.variable,
        beVietnamPro.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className={`min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
