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
import { getDynamicLaukSuggestions } from "@/actions/food-suggestion";

// Types
interface FoodData {
  id: string;
  nama: string;
  kalori: number;
}

interface FoodLogFormProps {
  food: FoodData;
}

// Component — Form for logging food consumption

function PortionInformation({ food }: FoodLogFormProps) {
  // Form state
  const [mealType, setMealType] = useState<Database["public"]["Enums"]["meal_category"] | "">(""  );
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

  // Submission state
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<
    { nama: string; kalori: number }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Calculated total calories based on portion
  const totalCalories = Math.round(food.kalori * portion);

  // Total calories including side dishes
  const sideDishCalories = sideDishes.reduce(
    (sum, dish) => sum + (dish.kalori ?? 0) * dish.porsi,
    0,
  );
  const totalCaloriesWithDishes = totalCalories + sideDishCalories;

  // ---- Lauk handlers ----
  function handleAddLauk() {
    const nama = newLaukNama.trim();
    if (!nama) return;
    if (newLaukPorsi <= 0) return;
    setSideDishes((prev) => [...prev, { nama, porsi: newLaukPorsi }]);
    setNewLaukNama("");
    setNewLaukPorsi(1);
  }

  // Suggest Lauk
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!food?.nama) return;

      setIsLoading(true);
      setSuggestion([]);

      try {
        const result = await getDynamicLaukSuggestions(food.nama);
        setSuggestion(result);
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
        setSuggestion([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestions();
  }, [food.nama]);

  function handleAddLaukFromSuggestion(nama: string, kalori: number) {
    // Prevent duplicates
    if (sideDishes.some((d) => d.nama.toLowerCase() === nama.toLowerCase()))
      return;
    setSideDishes((prev) => [...prev, { nama, porsi: 1, kalori }]);
  }

  function handleRemoveLauk(index: number) {
    setSideDishes((prev) => prev.filter((_, i) => i !== index));
  }

  // Handle form submission
  async function handleSubmit() {
    // Validation
    if (portion <= 0) {
      setError("Porsi harus lebih dari 0.");
      return;
    }

    setError(null);
    setIsLoading(true);

    // Refresh displayed submit time to reflect the actual click moment.
    // Note: this is display-only — the database records `logged_at` via `now()`.
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    setTime(`${hours}:${minutes}`);

    // Call server action directly (not inside startTransition)
    const result = await logFoodConsumption({
      foodId: food.id,
      portion,
      mealType: mealType || "makanan_berat",
      totalCalories: totalCaloriesWithDishes,
    });

    if (!result.success) {
      setError(result.error || "Gagal menyimpan data konsumsi.");
      setIsLoading(false);
      return;
    }

    // Success — redirect to dashboard
    router.push("/dashboard");
  }

  return (
    <div className="w-full lg:sticky lg:top-24 lg:self-start">
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
                  Lauk:{" "}
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
              />

              {/* Input lauk baru */}
              <div className="flex gap-2 items-center">
                <InputGroup className="flex-1">
                  <InputGroupInput
                    type="text"
                    className="placeholder:text-muted-foreground/60 w-full"
                    placeholder="Nama lauk..."
                    value={newLaukNama}
                    onChange={(e) => setNewLaukNama(e.target.value)}
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
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground shrink-0"
                >
                  <Plus size={16} />
                </Button>
              </div>

              {/* Saran lauk cepat */}
              <TagSelectFood
                suggestions={suggestion}
                onAdd={handleAddLaukFromSuggestion}
              />
            </CardContent>
          </Card>
        </div>

        {/* Submit button */}
        <Button
          className="w-full py-6"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
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
