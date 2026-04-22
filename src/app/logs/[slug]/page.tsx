import { PageProps } from "@/types";

import dummyFood from "@/data/dummy-frequently.json";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FaBowlFood } from "react-icons/fa6";

const addFood = async ({ params }: PageProps) => {
  const { slug } = await params;

  const food = dummyFood.find((item) => item.slug === slug);

  return (
    <div className="max-w-xl mx-auto p-6 w-full">
      <div className="flex flex-col items-center justify-center">
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
                <h2 className="text-xl font-bold">{food?.nama}</h2>
                <span className="bg-muted-foreground/20 text-secondary-foreground px-2 py-1.5 rounded-full flex items-center gap-2">
                  <FaBowlFood />
                  {food?.kalori} kcal / porsi
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default addFood;
