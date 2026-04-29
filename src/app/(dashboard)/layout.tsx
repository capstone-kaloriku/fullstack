import "@/app/globals.css";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className={`w-full mx-auto h-full bg-white flex `}>
      <DashboardSidebar>
        {children}
      </DashboardSidebar>
    </section>
  );
}
