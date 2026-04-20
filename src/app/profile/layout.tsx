import type { Metadata } from "next";
import "../globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Profile - KaloriKu",
  description: "Atur profile kamu yaa .",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className={`min-h-full flex flex-col py-12 overflow-hidden`}>
      <Header />
      {children}
    </section>
  );
}
