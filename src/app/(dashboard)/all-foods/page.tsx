"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { BsFillMoonFill, BsFillSunFill, BsSunriseFill } from "react-icons/bs";
import { FaQuestion, FaSearch, FaTimes } from "react-icons/fa";
import { getAllFoods, getRecentlyAddedFoods } from "../actions";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

import { IconCookieFilled } from "@tabler/icons-react";

import type { AIValidationResult } from "@/actions/custom-food";
import CustomFoods from "./components/CustomFoods";
import CustomFoodsModal from "./components/CustomFoodsModal";
import { RecentlyAdded } from "./components/RecentlyAdded";
import Carousel from "./components/Carousel";
import DisplayFood from "./components/DisplayFood";
import Pagination from "./components/Pagination";
import FilterCard from "./components/FilterCard";

// Constants
const ITEMS_PER_PAGE = 12;

const icon = [
  {
    id: 1,
    icon: <BsSunriseFill size={24} />,
    title: "Makanan Berat",
    filterKey: "makanan_berat",
  },
  {
    id: 2,
    icon: <BsFillSunFill size={24} />,
    title: "Makan Siang",
    filterKey: "makan_ringan",
  },
  {
    id: 3,
    icon: <BsFillMoonFill size={24} />,
    title: "Makan Malam",
    filterKey: "camilan",
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
    id: 6,
    icon: <IconCookieFilled size={24} />,
    title: "Vegetarian",
    filterKey: "vegetarian",
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

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Awaited<ReturnType<typeof getAllFoods>>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSearch, setActiveSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Recently Added state
  const [recentlyAdded, setRecentlyAdded] = useState<
    Awaited<ReturnType<typeof getRecentlyAddedFoods>>
  >([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);

  // AI Validation state
  const [validationData, setValidationData] =
    useState<AIValidationResult | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<
    string | undefined
  >();
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    async function fetchFoods() {
      setIsLoading(true);
      const foods = await getAllFoods();
      setData(foods);
      setIsLoading(false);
    }
    fetchFoods();
  }, []);

  // Fetch recently added foods
  const fetchRecentlyAdded = useCallback(async () => {
    setIsLoadingRecent(true);
    try {
      const recent = await getRecentlyAddedFoods(10);
      setRecentlyAdded(recent);
    } catch {
      console.error("Error fetching recently added foods");
    } finally {
      setIsLoadingRecent(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentlyAdded();
  }, [fetchRecentlyAdded]);

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

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
  const dataRecently = data.slice(0, 6);
  const filteredRecently = activeFilter
    ? dataRecently.filter((item) => item.kategori === activeFilter)
    : dataRecently;

  // Pagination — hitung total halaman dan slice data
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  // Lifting State untuk Dialog
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lifting State untuk Data Form
  const [foodTitle, setFoodTitle] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [foodImage, setFoodImage] = useState("");

  function handleFormChange(title: string, imageUrl: string) {
    setFoodTitle(title);
    setFoodImage(imageUrl);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal(open: boolean) {
    if (!open) {
      setIsModalOpen(false);
      // Reset validation state when modal is closed
      setValidationData(null);
      setUploadedImageUrl(undefined);
      setIsValidating(false);
    }
  }

  function handleValidationStart() {
    setValidationData(null);
    setUploadedImageUrl(undefined);
    setIsValidating(true);
  }

  function handleValidationComplete(
    data: AIValidationResult,
    imageUrl?: string,
  ) {
    setValidationData(data);
    setUploadedImageUrl(imageUrl);
    setIsValidating(false);
    setFoodDescription(data.deskripsi);
  }

  function handleSaveSuccess() {
    // Refresh recently added list after successful save
    fetchRecentlyAdded();
    // Also refresh all foods to include the new custom food
    getAllFoods().then((foods) => setData(foods));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <CustomFoodsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        foodTitle={foodTitle}
        foodDescription={foodDescription}
        foodImage={foodImage}
        validationData={validationData}
        uploadedImageUrl={uploadedImageUrl}
        isValidating={isValidating}
        onSaveSuccess={handleSaveSuccess}
      />
      <div className="max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-6 py-6 w-full overflow-x-hidden">
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
                        <Button
                          type="button"
                          onClick={clearSearch}
                          variant="ghost"
                          className="focus:outline-none flex items-center justify-center mr-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <FaTimes />
                        </Button>
                      ) : null}
                      <Button
                        type="submit"
                        variant="ghost"
                        className="focus:outline-none flex items-center justify-center"
                      >
                        <FaSearch />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </form>
              </div>
              {/* Carousel */}
              <Carousel />
              {!isSearchActive && (
                <main className="grid grid-cols-1 lg:grid-cols-3 w-full gap-3 py-6">
                  <article className="flex flex-col gap-3 h-full">
                    <CustomFoods
                      openModal={openModal}
                      onFormChange={handleFormChange}
                      onValidationComplete={handleValidationComplete}
                      onValidationStart={handleValidationStart}
                    />
                  </article>
                  <aside className="lg:col-span-2 flex flex-col gap-3 h-full">
                    <FilterCard
                      data={icon}
                      activeFilter={activeFilter}
                      onFilter={handleFilter}
                    />
                    <RecentlyAdded
                      items={recentlyAdded}
                      isLoading={isLoadingRecent}
                    />
                  </aside>
                </main>
              )}
            </div>
          </div>

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
                  <span className="text-4xl">
                    <FaQuestion />
                  </span>
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
