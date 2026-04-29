import Link from "next/link";
import Frequently from "./components/Frequently";
import Searchbar from "./components/Searchbar";
import Tips from "./components/Tips";

import dummyData from "@/data/dummy-food.json"
import CustomFood from "./components/CustomFood";

const frequentlyData = dummyData.slice(0, 4);



const Logs = () => {
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
              Sering Dicatat
              <Link href="/all-foods" className="text-sm text-primary">
                Lihat Semua
              </Link>
            </div>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-4 w-full">
              <Frequently data={frequentlyData} />
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
