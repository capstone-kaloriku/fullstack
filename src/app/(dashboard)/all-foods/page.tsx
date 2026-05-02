"use client";

import { useState, useEffect } from "react";
import DisplayFood from "./components/DisplayFood";
import Category from "./components/Category";
import { BsFillMoonFill, BsFillSunFill, BsSunriseFill } from "react-icons/bs";
import { LiaCookieBiteSolid } from "react-icons/lia";
import { getAllFoods } from "../actions";

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
  const [data, setData] = useState<Awaited<ReturnType<typeof getAllFoods>>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFoods() {
      setIsLoading(true);
      const foods = await getAllFoods();
      setData(foods);
      setIsLoading(false);
    }
    fetchFoods();
  }, []);

  const filteredData = activeFilter
    ? data.filter((item) => item.kategori === activeFilter)
    : data;

  const dataRecently = data.slice(0, 4);
  const filteredRecently = activeFilter
    ? dataRecently.filter((item) => item.kategori === activeFilter)
    : dataRecently;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

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
