import Link from "next/link";

import { BsFillMoonFill, BsFillSunFill, BsSunriseFill } from "react-icons/bs";
import { LiaCookieBiteSolid } from "react-icons/lia";

import Category from "./components/Category";
import Frequently from "./components/Frequently";
import Searchbar from "./components/Searchbar";
import Tips from "./components/Tips";

import dummyData from "@/data/dummy-food.json"

const frequentlyData = dummyData.slice(0, 2);

const icon = [
  {
    id: 1,
    icon: <BsSunriseFill size={24} className="text-primary" />,
    title: "MAKAN PAGI",
  },
  {
    id: 2,
    icon: <BsFillSunFill size={24} className="text-primary" />,
    title: "MAKAN SIANG",
  },
  {
    id: 3,
    icon: <BsFillMoonFill size={24} className="text-primary" />,
    title: "MAKAN MALAM",
  },
  {
    id: 4,
    icon: <LiaCookieBiteSolid size={24} className="text-primary" />,
    title: "MAKANAN RINGAN",
  },
];

const Logs = () => {
  return (
    <>
      <div className="max-w-2xl p-6 mx-auto w-full">
        <div className="flex flex-col items-center justify-center">
          <Searchbar />
          <Category data={icon} />
          <div className="w-full flex flex-col gap-6 my-6">
            <div className="text-lg font-bold justify-between flex items-center">
              Sering Dicatat
              <Link href="/all-foods" className="text-sm text-primary">
                Lihat Semua
              </Link>
            </div>
            <Frequently data={frequentlyData} />
          </div>
          <div className="w-full flex-col">
            <Tips />
          </div>
        </div>
      </div>
    </>
  );
};

export default Logs;
