import Link from "next/link";
import Frequently from "./components/Frequently";
import Tips from "./components/Tips";
import ConsumptionHistory from "./components/ConsumptionHistory";

import { getAllFoods } from "../actions";

const Logs = async () => {
  const allFoods = await getAllFoods();
  const displayData = allFoods.slice(0, 4);

  return (
    <>
      <div className="max-w-2xl lg:max-w-6xl xl:max-w-full px-6 py-6 mx-auto w-full overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content (Left Column on Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-8 w-full">
            <div className="w-full flex flex-col gap-4">
              <div className="text-lg font-bold flex justify-between items-center w-full">
                <span>Sering Dicatat</span>
                <Link
                  href="/all-foods"
                  className="text-sm text-primary hover:underline"
                >
                  Lihat Semua
                </Link>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 w-full">
                {displayData.length > 0 ? (
                  <Frequently data={displayData} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Belum ada makanan yang dicatat.
                  </p>
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

