import Link from "next/link";
import Frequently from "./components/Frequently";
import Searchbar from "./components/Searchbar";
import Tips from "./components/Tips";

import CustomFood from "./components/CustomFood";
import { getAllFoods } from "../actions";

const Logs = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : undefined;
  
  const allFoods = await getAllFoods(q);
  // Jika ada pencarian, tampilkan hasil pencarian, sebaliknya tampilkan 4 item teratas.
  const displayData = q ? allFoods : allFoods.slice(0, 4);

  return (
    <>
      <div className="max-w-2xl lg:max-w-5xl px-6 mx-auto w-full overflow-x-hidden">
        <div className="flex flex-col items-center justify-center">
          <Searchbar />
          <div className="flex flex-col items-start justify-center w-full gap-6">
            <h1 className="text-lg font-bold text-primary">
              Input Makanan Custommu
            </h1>
            <CustomFood />
          </div>
          <div className="w-full flex flex-col gap-6 my-6">
            <div className="text-lg font-bold justify-between flex items-center">
              {q ? `Hasil Pencarian: ${q}` : "Sering Dicatat"}
              {!q && (
                <Link href="/all-foods" className="text-sm text-primary">
                  Lihat Semua
                </Link>
              )}
            </div>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-4 w-full">
              {displayData.length > 0 ? (
                <Frequently data={displayData} />
              ) : (
                <p className="text-sm text-muted-foreground">Makanan tidak ditemukan.</p>
              )}
            </div>
          </div>
          <div className="w-full flex-col mb-8">
            <Tips />
          </div>
        </div>
      </div>
    </>
  );
};

export default Logs;
