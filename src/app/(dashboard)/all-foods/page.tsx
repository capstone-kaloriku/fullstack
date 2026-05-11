"use client";

import { useState, useEffect, useMemo } from "react";
import DisplayFood from "./components/DisplayFood";
import Category from "./components/Category";
import Pagination from "./components/Pagination";
import { BsFillMoonFill, BsFillSunFill, BsSunriseFill } from "react-icons/bs";
import { LiaCookieBiteSolid } from "react-icons/lia";
import { getAllFoods } from "../actions";

// ============================================================
// Constants
// ============================================================

const ITEMS_PER_PAGE = 6;

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

// ============================================================
// Component
// ============================================================

const AllFood = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [data, setData] = useState<Awaited<ReturnType<typeof getAllFoods>>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchFoods() {
      setIsLoading(true);
      const foods = await getAllFoods();
      setData(foods);
      setIsLoading(false);
    }
    fetchFoods();
  }, []);

  // Reset ke halaman 1 saat filter berubah
  function handleFilter(filter: string | null) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  // Data yang sudah di-filter
  const filteredData = activeFilter
    ? data.filter((item) => item.kategori === activeFilter)
    : data;

  // "Sering Dimakan" — tetap 4 item, tanpa pagination
  const dataRecently = data.slice(0, 4);
  const filteredRecently = activeFilter
    ? dataRecently.filter((item) => item.kategori === activeFilter)
    : dataRecently;

  // Pagination — hitung total halaman dan slice data
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl lg:max-w-6xl xl:max-w-full mx-auto px-6 py-6 w-full overflow-x-hidden">
        <div className="flex flex-col gap-8">
          <div className="w-full">
            <Category
              data={icon}
              activeFilter={activeFilter}
              onFilter={handleFilter}
            />
          </div>
          {filteredRecently.length > 0 && (
            <div className="flex flex-col gap-4 w-full">
              <h1 className="text-lg font-bold text-primary">Sering Dimakan</h1>
              <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                <DisplayFood data={filteredRecently} />
              </div>
            </div>
          )}
          <div className="flex flex-col gap-4 w-full border-t pt-6 sm:border-t-0 sm:pt-0">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-primary">
                {activeFilter ? `Hasil Filter` : "Semua Makanan"}
              </h1>
              <span className="text-sm text-muted-foreground">
                {filteredData.length} makanan
                {activeFilter ? ' ditemukan' : ''}
              </span>
            </div>
            {paginatedData.length > 0 ? (
              <>
                <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  <DisplayFood data={paginatedData} />
                </div>
                <div className="mt-4 flex justify-center w-full">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground w-full">
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
