import "@/app/globals.css";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function MainLayout({
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
