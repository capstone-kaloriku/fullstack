import type { Metadata } from "next";
import "../globals.css";

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
    <section className={`min-h-full flex flex-col overflow-hidden`}>
      {children}
    </section>
  );
}
