import { PageProps } from "@/types";

import dummyFood from "@/data/dummy-frequently.json";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const addFood = async ({ params }: PageProps) => {
  const { slug } = await params;

  return (
    <div className="max-w-xl mx-auto p-6 w-full">
      <div className="flex flex-col items-center justify-center">
        <Card className="w-full py-6">
          <CardContent className="flex flex-col justify-center items-center gap-5">
            <Image
              src="/profile.jpg"
              className="rounded-full"
              alt="gambar"
              width={100}
              height={100}
            />
            <div className="flex flex-col items-center justify-center">
              <h2>Nasi Goreng</h2>
              <span>350 kcal / porsi</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default addFood;
