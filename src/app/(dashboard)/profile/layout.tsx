import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Profile - KaloriKu",
  description: "Halaman Profil di KaloriKu memungkinkan pengguna untuk mengelola informasi pribadi, preferensi, dan pengaturan akun mereka.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  );
}
