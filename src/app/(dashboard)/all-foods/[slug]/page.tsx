import { PageProps } from "@/types";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { FaBowlFood } from "react-icons/fa6";
import { getFoodBySlug } from "../../actions";
import FoodLogForm from "./components/FoodLogForm";


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
    <main className="min-h-screen w-full pb-12">
      <div className="mx-auto w-full max-w-xl px-4 py-8 md:max-w-6xl md:px-8 lg:max-w-7xl xl:max-w-full">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="w-full flex flex-col items-start gap-6">
            {/* Food Image */}
            <Card className="w-full py-6">
              <CardContent className="flex flex-col items-center justify-center gap-5">
                <div className="relative w-full aspect-video sm:aspect-[4/3] md:aspect-video overflow-hidden rounded-xl">
                  <Image
                    src="/profile.jpg"
                    className="object-cover"
                    alt="gambar"
                    fill
                  />
                </div>
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
          {/* Form — client component (handles state + submit, termasuk lauk) */}
          <div className="w-full">
            <FoodLogForm food={{ id: food.id, nama: food.nama, kalori: food.kalori }} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddFood;
