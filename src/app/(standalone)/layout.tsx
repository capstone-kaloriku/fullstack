import "@/app/globals.css";

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
