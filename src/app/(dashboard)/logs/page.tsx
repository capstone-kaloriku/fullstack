import Link from "next/link";
import Frequently from "./components/Frequently";
import Searchbar from "./components/Searchbar";
import Tips from "./components/Tips";
import ConsumptionHistory from "./components/ConsumptionHistory";

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
      <div className="max-w-2xl lg:max-w-6xl xl:max-w-full px-6 py-6 mx-auto w-full overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content (Left Column on Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-8 w-full">
            <Searchbar />
            <div className="flex flex-col items-start justify-center w-full gap-4">
              <h1 className="text-lg font-bold text-primary">
                Input Makanan Custommu
              </h1>
              <CustomFood />
            </div>
            <div className="w-full flex flex-col gap-4 border-t pt-6 lg:border-t-0 lg:pt-0">
              <div className="text-lg font-bold flex justify-between items-center w-full">
                <span>{q ? `Hasil Pencarian: ${q}` : "Sering Dicatat"}</span>
                {!q && (
                  <Link href="/all-foods" className="text-sm text-primary hover:underline">
                    Lihat Semua
                  </Link>
                )}
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 w-full">
                {displayData.length > 0 ? (
                  <Frequently data={displayData} />
                ) : (
                  <p className="text-sm text-muted-foreground">Makanan tidak ditemukan.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar (Right Column on Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-8 w-full border-t pt-6 lg:border-t-0 lg:pt-0">
            {/* Riwayat Konsumsi — weekly navigation + delete */}
            <div className="w-full flex flex-col">
              <ConsumptionHistory />
            </div>

            <div className="w-full flex-col">
              <Tips />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logs;
