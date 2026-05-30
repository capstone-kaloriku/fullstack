"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import DisplayFood from "./components/DisplayFood";
import Pagination from "./components/Pagination";
import { BsFillMoonFill, BsFillSunFill, BsSunriseFill } from "react-icons/bs";
import { FaSearch, FaTimes } from "react-icons/fa";
import { getAllFoods } from "../actions";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import PopularCategory from "./components/PopularCategory";
import { IconCookieFilled } from "@tabler/icons-react";

// ============================================================
// Constants
// ============================================================

const ITEMS_PER_PAGE = 6;

const icon = [
  {
    id: 1,
    icon: <BsSunriseFill size={24} />,
    title: "Makan Pagi",
    filterKey: "sarapan",
  },
  {
    id: 2,
    icon: <BsFillSunFill size={24} />,
    title: "Makan Siang",
    filterKey: "makan siang",
  },
  {
    id: 3,
    icon: <BsFillMoonFill size={24} />,
    title: "Makan Malam",
    filterKey: "makan malam",
  },
  {
    id: 4,
    icon: <IconCookieFilled size={24} />,
    title: "Makanan Ringan",
    filterKey: "camilan",
  },
  {
    id: 5,
    icon: <IconCookieFilled size={24} />,
    title: "Rendah Kalori",
    filterKey: "rendah-kalori",
  },
  {
    id: 6, icon: <IconCookieFilled size={24} />,
    title: "Vegetarian",
    filterKey: "vegetarian",
  }
];

// ============================================================
// Component
// ============================================================

const AllFood = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [data, setData] = useState<Awaited<ReturnType<typeof getAllFoods>>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Awaited<ReturnType<typeof getAllFoods>>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSearch, setActiveSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function fetchFoods() {
      setIsLoading(true);
      const foods = await getAllFoods();
      setData(foods);
      setIsLoading(false);
    }
    fetchFoods();
  }, []);

  // Debounced search — triggers 300ms after user stops typing
  const performSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setActiveSearch("");
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const results = await getAllFoods(trimmed);
      setSearchResults(results);
      setActiveSearch(trimmed);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setActiveSearch("");
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    performSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const isSearchActive = activeSearch.length > 0;

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
          <div className="grid grid-cols-1 gap-4 w-full">
            <div className="flex flex-col w-full gap-6">
              {/* Integrated Searchbar */}
              <div className="w-full flex flex-col gap-4">
                <h1 className="text-lg font-bold text-primary">Cari Makanan</h1>
                <form onSubmit={handleSearchSubmit}>
                  <InputGroup className="px-4 py-6 rounded-lg border border-gray-300 text-muted-foreground">
                    <InputGroupInput
                      placeholder="Cari makanan Indonesia..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    <InputGroupAddon>
                      {isSearchActive || searchQuery ? (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="focus:outline-none flex items-center justify-center mr-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <FaTimes />
                        </button>
                      ) : null}
                      <button
                        type="submit"
                        className="focus:outline-none flex items-center justify-center"
                      >
                        <FaSearch />
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                </form>
              </div>

              {!isSearchActive && (
                <PopularCategory
                  data={icon}
                  activeFilter={activeFilter}
                  onFilter={handleFilter}
                />
              )}
            </div>
          </div>

          {/* ====== Search Results View ====== */}
          {isSearchActive ? (
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold text-primary">
                  Hasil Pencarian: &ldquo;{activeSearch}&rdquo;
                </h1>
                <span className="text-sm text-muted-foreground">
                  {searchResults.length} makanan ditemukan
                </span>
              </div>
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="sm:grid sm:grid-cols-2 lg:grid-cols-6 gap-4 w-full">
                  <DisplayFood data={searchResults} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground w-full">
                  <span className="text-4xl">🔍</span>
                  <p className="text-sm font-medium">
                    Makanan tidak ditemukan untuk &ldquo;{activeSearch}&rdquo;
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* ====== Default View (Sering Dimakan + Semua Makanan) ====== */
            <>
              {filteredRecently.length > 0 && (
                <div className="flex flex-col gap-4 w-full">
                  <h1 className="text-lg font-bold text-primary">
                    Sering Dimakan
                  </h1>
                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 w-full">
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
                    {activeFilter ? " ditemukan" : ""}
                  </span>
                </div>
                {paginatedData.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 w-full">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllFood;
