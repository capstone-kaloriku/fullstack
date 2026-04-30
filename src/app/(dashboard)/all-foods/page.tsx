"use client";

import { useState } from "react";
import dummyData from "@/data/dummy-food.json";
import DisplayFood from "./components/DisplayFood";
import Category from "./components/Category";
import { BsFillMoonFill, BsFillSunFill, BsSunriseFill } from "react-icons/bs";
import { LiaCookieBiteSolid } from "react-icons/lia";

const dataRecently = dummyData.slice(0, 4);
const data = dummyData;

const icon = [
  {
    id: 1,
    icon: <BsSunriseFill size={24} className="text-primary" />,
    title: "MAKAN PAGI",
    filterKey: "sarapan",
  },
  {
    id: 2,
    icon: <BsFillSunFill size={24} className="text-primary" />,
    title: "MAKAN SIANG",
    filterKey: "makan siang",
  },
  {
    id: 3,
    icon: <BsFillMoonFill size={24} className="text-primary" />,
    title: "MAKAN MALAM",
    filterKey: "makan malam",
  },
  {
    id: 4,
    icon: <LiaCookieBiteSolid size={24} className="text-primary" />,
    title: "MAKANAN RINGAN",
    filterKey: "camilan",
  },
];

const AllFood = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredData = activeFilter
    ? data.filter((item) => item.kategori === activeFilter)
    : data;

  const filteredRecently = activeFilter
    ? dataRecently.filter((item) => item.kategori === activeFilter)
    : dataRecently;

  return (
    <div className="">
      <div className="max-w-2xl lg:max-w-5xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Category
              data={icon}
              activeFilter={activeFilter}
              onFilter={setActiveFilter}
            />
          </div>
          {filteredRecently.length > 0 && (
            <div className="flex flex-col gap-6">
              <h1 className="text-lg font-bold text-primary">Sering Dimakan</h1>
              <div className="flex flex-col md:grid md:grid-cols-2 items-center w-full gap-6">
                <DisplayFood data={filteredRecently} />
              </div>
            </div>
          )}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-primary">
                {activeFilter ? `Hasil Filter` : "Semua Makanan"}
              </h1>
              {activeFilter && (
                <span className="text-sm text-muted-foreground">
                  {filteredData.length} makanan ditemukan
                </span>
              )}
            </div>
            {filteredData.length > 0 ? (
              <div className="flex flex-col md:grid md:grid-cols-2 items-center w-full gap-6">
                <DisplayFood data={filteredData} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                <span className="text-4xl">🍽️</span>
                <p className="text-sm font-medium">
                  Tidak ada makanan dalam kategori ini
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllFood;
