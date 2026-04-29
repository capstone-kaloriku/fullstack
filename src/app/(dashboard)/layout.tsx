import "@/app/globals.css";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className={`flex h-screen overflow-y-auto w-full bg-white`}>
      <DashboardSidebar>
        {children}
      </DashboardSidebar>
    </section>
  );
}
