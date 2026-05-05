import { PageProps } from "@/types";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { FaBowlFood } from "react-icons/fa6";

import { getFoodBySlug } from "../../actions";
import FoodLogForm from "./components/FoodLogForm";

// ============================================================
// Page — Server component that fetches food data by slug
// ============================================================

const AddFood = async ({ params }: PageProps) => {
  const { slug } = await params;

  // Fetch food data from DB
  const food = await getFoodBySlug(slug);

  // Handle food not found
  if (!food) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Makanan tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto">
      <div className="max-w-xl mx-auto px-6 w-full py-6">
        <div className="flex flex-col items-center justify-center gap-6">

          {/* Food info card — server rendered */}
          <div className="w-full">
            <Card className="w-full py-6">
              <CardContent className="flex flex-col justify-center items-center gap-5">
                <Image
                  src="/profile.jpg"
                  className="rounded-full"
                  alt="gambar"
                  width={100}
                  height={100}
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <h2 className="text-xl font-bold">{food.nama}</h2>
                  <span className="bg-muted-foreground/20 text-secondary-foreground px-2 py-1.5 rounded-full flex items-center gap-2">
                    <FaBowlFood />
                    {food.kalori || "0"} kcal / porsi
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form — client component (handles state + submit) */}
          <FoodLogForm food={{ id: food.id, nama: food.nama, kalori: food.kalori }} />

        </div>
      </div>
    </div>
  );
};

export default AddFood;
