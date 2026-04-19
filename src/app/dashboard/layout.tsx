import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro, Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Header } from "./components/Header";

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
  title: "Dashboard - KaloriKu",
  description:
    "Pantau asupan kalori harian Anda dengan Kaloriku. Aplikasi yang membantu Anda mencapai tujuan kesehatan dan kebugaran dengan mudah.",
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
      <body className={`min-h-full flex flex-col py-12`} suppressHydrationWarning>
        <Header />
        {children}
      </body>
    </html>
  );
}
