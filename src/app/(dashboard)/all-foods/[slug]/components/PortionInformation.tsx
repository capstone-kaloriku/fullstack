"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaBowlFood, FaUtensils } from "react-icons/fa6";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

import { logFoodConsumption } from "../../../actions";
import ListSelectedFood from "./ui/ListSelectedFood";
import TagSelectFood from "./ui/TagSelectFood";
import type { SideDish } from "@/types";
import type { Database } from "@/lib/supabase/types";
import {
  getDynamicLaukSuggestions,
  addManualLauk,
  saveLaukComponents,
  detectMealCategory,
  type MealCategory,
} from "@/actions/food-suggestion";

// Types
interface FoodData {
  id: string;
  nama: string;
  kalori: number;
  kategori?: string; // digunakan untuk auto-detect meal type
}

interface FoodLogFormProps {
  food: FoodData;
}

// Component — Form for logging food consumption

function PortionInformation({ food }: FoodLogFormProps) {
  // Form state
  const [mealType, setMealType] = useState<MealCategory>("makanan_berat");
  const [isMealTypeAI, setIsMealTypeAI] = useState(false); // true = di-suggest AI, false = user override
  const [time, setTime] = useState<string>("");
  const [portion, setPortion] = useState<number>(1);

  const perPortionCalories = food.kalori ?? 0;

  // Side dishes state
  const [sideDishes, setSideDishes] = useState<SideDish[]>([]);
  const [newLaukNama, setNewLaukNama] = useState<string>("");
  const [newLaukPorsi, setNewLaukPorsi] = useState<number>(1);

  useEffect(() => {
    // Avoid synchronous state updates during initial render/effect phase
    const timer = setTimeout(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Auto-detect meal type — AI suggest, user bisa override
  useEffect(() => {
    const detect = async () => {
      const detected = await detectMealCategory(food.nama, food.kategori);
      setMealType(detected);
      setIsMealTypeAI(true);
    };
    detect();
  }, [food.nama, food.kategori]);

  /**
   * @kevin — state dipisah: isSubmitting untuk submit form,
   * isFetchingSuggestions untuk loading saran lauk dari AI.
   * Sebelumnya pakai 1 isLoading yg bikin submit button disabled saat fetch.
   */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [isAddingLauk, setIsAddingLauk] = useState(false);
  const [suggestion, setSuggestion] = useState<
    { nama: string; kalori: number }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [laukError, setLaukError] = useState<string | null>(null);
  const router = useRouter();

  const totalCalories = Math.round(food.kalori * portion);

  const sideDishCalories = sideDishes.reduce(
    (sum, dish) => sum + (dish.kalori ?? 0) * dish.porsi,
    0,
  );
  const totalCaloriesWithDishes = totalCalories + sideDishCalories;

  // ---- Lauk handlers ----
  async function handleAddLauk() {
    const nama = newLaukNama.trim();
    if (!nama) return;
    if (newLaukPorsi <= 0) return;

    // Cek duplikat lokal
    if (sideDishes.some((d) => d.nama.toLowerCase() === nama.toLowerCase())) {
      setLaukError(`"${nama}" sudah ada di daftar lauk.`);
      return;
    }

    setLaukError(null);
    setIsAddingLauk(true);

    try {
      // Validasi AI (TIDAK save ke DB — save saat Simpan)
      const result = await addManualLauk(nama);

      if (!result.success || !result.data) {
        setLaukError(result.error || "Gagal menambahkan lauk.");
        return;
      }

      // Tambah ke state lokal dengan data kalori dari AI
      const validated = result.data;
      setSideDishes((prev) => [
        ...prev,
        { nama: validated.nama, porsi: newLaukPorsi, kalori: validated.kalori },
      ]);
      setNewLaukNama("");
      setNewLaukPorsi(1);
    } catch (err) {
      console.error("Failed to add lauk", err);
      setLaukError("Terjadi kesalahan saat validasi lauk.");
    } finally {
      setIsAddingLauk(false);
    }
  }

  // Suggest Lauk — DB-first, Groq fallback
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!food?.id || !food?.nama) return;

      setIsFetchingSuggestions(true);
      setSuggestion([]);

      try {
        const result = await getDynamicLaukSuggestions(food.id, food.nama);
        setSuggestion(result);
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
        setSuggestion([]);
      } finally {
        setIsFetchingSuggestions(false);
      }
    };
    fetchSuggestions();
  }, [food.id, food.nama]);

  function handleAddLaukFromSuggestion(nama: string, kalori: number) {
    // If already exists, increment porsi instead of ignoring
    const existingIndex = sideDishes.findIndex(
      (d) => d.nama.toLowerCase() === nama.toLowerCase(),
    );
    if (existingIndex !== -1) {
      setSideDishes((prev) =>
        prev.map((d, i) =>
          i === existingIndex ? { ...d, porsi: d.porsi + 1 } : d,
        ),
      );
      return;
    }
    setSideDishes((prev) => [...prev, { nama, porsi: 1, kalori }]);
  }

  function handleRemoveLauk(index: number) {
    setSideDishes((prev) => prev.filter((_, i) => i !== index));
  }

  function handleChangePorsi(index: number, newPorsi: number) {
    if (newPorsi < 1) return;
    setSideDishes((prev) =>
      prev.map((d, i) => (i === index ? { ...d, porsi: newPorsi } : d)),
    );
  }

  // Handle form submission
  async function handleSubmit() {
    // Validation
    if (portion <= 0) {
      setError("Porsi harus lebih dari 0.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    // Refresh displayed submit time to reflect the actual click moment.
    // Note: this is display-only — the database records `logged_at` via `now()`.
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    setTime(`${hours}:${minutes}`);

    // 1. Save consumption log
    const result = await logFoodConsumption({
      foodId: food.id,
      portion,
      mealType,
      totalCalories: totalCaloriesWithDishes,
    });

    if (!result.success) {
      setError(result.error || "Gagal menyimpan data konsumsi.");
      setIsSubmitting(false);
      return;
    }

    // 2. Save lauk ke food_components (hanya yg dipilih user)
    if (sideDishes.length > 0) {
      const laukToSave = sideDishes.map((d) => ({
        nama: d.nama,
        kalori: d.kalori ?? 0,
      }));
      await saveLaukComponents(food.id, laukToSave);
    }

    // Success — redirect to dashboard
    router.push("/dashboard");
  }

  return (
    <div className="w-full lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <FieldGroup>
        {/* Error banner */}
        {error && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3">
            {error}
          </div>
        )}

        {/* Jam Submit */}
        <div className="w-full">
          <Card className="w-full py-6">
            <CardHeader className="flex flex-row items-center gap-5">
              <FaBowlFood size={18} className="text-primary" />
              <CardTitle className="text-lg font-bold">Porsi</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-start gap-5">
              {/* Meal Type Selector — AI pre-select, user bisa override */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Jenis Makanan
                  </span>
                  {isMealTypeAI && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                      AI
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { value: "makanan_berat", label: "Makanan Berat" },
                      { value: "makanan_ringan", label: "Makanan Ringan" },
                      { value: "camilan", label: "Camilan" },
                      { value: "minuman", label: "Minuman" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setMealType(opt.value);
                        setIsMealTypeAI(false); // user override → sembunyikan badge AI
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        mealType === opt.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input porsi */}
              <InputGroup className="border-gray-300">
                <InputGroupInput
                  min={0}
                  type="number"
                  className="placeholder:text-primary/50 text-primary w-full "
                  placeholder="Berapa porsi? ..."
                  value={portion}
                  onChange={(e) => setPortion(Number(e.target.value) || 0)}
                />
              </InputGroup>
              {/* Live calorie preview */}
              <span className="text-sm text-muted-foreground">
                Makanan:{" "}
                <p className="text-primary font-bold">{totalCalories} kcal</p> (
                {portion} porsi × {perPortionCalories} kcal)
              </span>
              {sideDishCalories > 0 && (
                <span className="text-sm text-muted-foreground">
                  Lauk:
                  <p className="text-primary font-bold">
                    +{sideDishCalories} kcal
                  </p>
                </span>
              )}
              {sideDishCalories > 0 && (
                <span className="text-sm font-semibold text-primary border-t border-primary/20 pt-2 w-full">
                  Total: {totalCaloriesWithDishes} kcal
                </span>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lauk Makanan */}
        <div className="w-full">
          <Card className="w-full py-6">
            <CardHeader className="flex flex-row items-center gap-5">
              <FaUtensils size={18} className="text-primary" />
              <CardTitle className="text-lg font-bold">Lauk Makanan</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Lauk yang sudah dipilih */}
              <ListSelectedFood
                items={sideDishes}
                onRemove={handleRemoveLauk}
                onChangePorsi={handleChangePorsi}
              />

              {/* Input lauk baru */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <InputGroup className="flex-1">
                    <InputGroupInput
                      type="text"
                      className="placeholder:text-muted-foreground/60 w-full"
                      placeholder="Nama lauk..."
                      value={newLaukNama}
                      disabled={isAddingLauk}
                      onChange={(e) => {
                        setNewLaukNama(e.target.value);
                        setLaukError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddLauk();
                        }
                      }}
                    />
                  </InputGroup>
                  <InputGroup className="w-20">
                    <InputGroupInput
                      type="number"
                      min={1}
                      className="text-center"
                      placeholder="Porsi"
                      value={newLaukPorsi}
                      disabled={isAddingLauk}
                      onChange={(e) =>
                        setNewLaukPorsi(Number(e.target.value) || 1)
                      }
                    />
                  </InputGroup>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddLauk}
                    disabled={isAddingLauk || !newLaukNama.trim()}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground shrink-0"
                  >
                    {isAddingLauk ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                  </Button>
                </div>
                {isAddingLauk && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Loader2 size={12} className="animate-spin" />
                    Memvalidasi lauk dengan AI...
                  </p>
                )}
                {laukError && (
                  <p className="text-xs text-destructive">{laukError}</p>
                )}
              </div>

              {/* Saran lauk cepat */}

              <TagSelectFood
                suggestions={suggestion}
                onAdd={handleAddLaukFromSuggestion}
                selectedNames={sideDishes.map((d) => d.nama)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Submit button */}
        <Button
          className="w-full py-6"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Menyimpan...
            </>
          ) : (
            "Simpan"
          )}
        </Button>
      </FieldGroup>
    </div>
  );
}

export default PortionInformation;
