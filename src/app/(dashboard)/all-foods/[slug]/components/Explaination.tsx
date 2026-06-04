"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  getFoodExplanation,
  type FoodExplanation,
} from "@/actions/food-explanation";

interface ExplainationProps {
  foodName: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

function Explaination({
  foodName,
  calories,
  protein,
  carbs,
  fat,
}: ExplainationProps) {
  const [data, setData] = useState<FoodExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExplanation = async () => {
      setIsLoading(true);
      try {
        const result = await getFoodExplanation(
          foodName,
          calories,
          protein,
          carbs,
          fat,
        );
        setData(result);
      } catch (err) {
        console.error("Failed to fetch explanation", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExplanation();
  }, [foodName, calories, protein, carbs, fat]);

  return (
    <div className="justify-self-center lg:col-span-2">
      <div className="flex flex-col w-full justify-start items-start gap-6">
        <h1 className="text-2xl font-bold">
          Penjelasan dari <span className="text-primary">KalorAI</span>
        </h1>

        {isLoading ? (
          <div className="flex items-center gap-2 py-8 text-muted-foreground">
            <Loader2 size={18} className="animate-spin text-primary" />
            <span className="text-sm">Menganalisis makanan...</span>
          </div>
        ) : data ? (
          <>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg text-secondary-foreground">
                Ringkasan Makanan
              </h2>
              <p className="text-muted-foreground">{data.ringkasan}</p>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg text-secondary-foreground">
                Komposisi Nutrisi
              </h2>
              <p className="text-muted-foreground">{data.komposisi}</p>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg text-secondary-foreground">
                Tips Makan
              </h2>
              <p className="text-muted-foreground">{data.tips}</p>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">
            Gagal memuat penjelasan. Coba refresh halaman.
          </p>
        )}
      </div>
    </div>
  );
}

export default Explaination;
