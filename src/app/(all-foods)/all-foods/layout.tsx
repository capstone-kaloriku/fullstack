import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "All Foods - KaloriKu",
  description:
    "Halaman seluruh Makanan di KaloriKu memungkinkan pengguna untuk melihat daftar semua makanan yang tersedia. Dengan tampilan yang mudah dipahami, pengguna dapat mencari dan menambahkan makanan ke dalam catatan harian mereka.",
};

export default function AllFoodsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <section className={`min-h-full flex flex-col py-12 overflow-hidden`}>
      {children}
    </section>
  );
}
