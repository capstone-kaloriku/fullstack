import type { Metadata } from "next";
import "../globals.css";
import { Header } from "@/components/Header";
import { DashboardSidebar } from "@/components/DashboardSidebar";

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
    <section className={`h-screen overflow-y-auto`}>
      <DashboardSidebar>
        {children}
      </DashboardSidebar>
    </section>
  );
}
