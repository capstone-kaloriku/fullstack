import { PageProps } from "@/types";

import dummyFood from "@/data/dummy-frequently.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { FaBowlFood, FaClock, FaSun } from "react-icons/fa6";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import NavbarSlug from "./components/NavbarSlug";

const addFood = async ({ params }: PageProps) => {

  const { slug } = await params;

  const food = dummyFood.find((item) => item.slug === slug);

  const foodTypes = [
    {
      id: 1,
      label: "Pagi",
    },
    {
      id: 2,
      label: "Siang",
    },
    {
      id: 3,
      label: "Malam",
    },
    {
      id: 4,
      label: "Camilan",
    },
  ]

  return (
    <>
      <NavbarSlug>
        Catat makananmu
      </NavbarSlug>
      <div className="max-w-xl mx-auto px-6 py-24 w-full">
        <div className="flex flex-col items-center justify-center gap-6">
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
          <div className="w-full">
            <Card className="w-full py-6">
              <CardHeader className="flex items-center gap-5">
                <FaClock size={18} className="text-primary" />
                <CardTitle className="text-lg font-bold">Jam Makan</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-start gap-5">
                <div className="flex items-center justify-center gap-2 w-full">
                  <InputGroup className="px-4 py-6 flex items-center rounded-lg border border-primary text-primary w-full">
                    <InputGroupInput type="time" className='placeholder:text-primary/50 w-full' placeholder="Jam berapa kamu makan? ..." />
                  </InputGroup>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full">
            <Card className="w-full py-6">
              <CardHeader className="flex flex-row items-center gap-5">
                <FaBowlFood size={18} className="text-primary" />
                <CardTitle className="text-lg font-bold">Porsi</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-start gap-5">
                <InputGroup>
                  <InputGroupInput min={0} type="number" className='placeholder:text-primary/50 text-primary w-full' placeholder="Berapa porsi? ..." />
                  <InputGroupAddon align={"inline-end"} className="text-primary text-lg font-bold">Porsi</InputGroupAddon>
                </InputGroup>
              </CardContent>
            </Card>
          </div>
          <div className="w-full">
            <Card>
              <CardHeader className="flex flex-row items-center gap-5">
                <FaSun size={18} className="text-primary" />
                <CardTitle className="text-lg font-bold">Jenis Makanan</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-start gap-5">
                <ToggleGroup className="grid grid-cols-2 gap-2 rounded-2xl items-center justify-center mx-auto w-full" spacing={2}>
                  {foodTypes.map((item) => (
                    <ToggleGroupItem key={item.id} className="flex-1 border border-primary aria-pressed:bg-primary aria-pressed:text-secondary" variant={"outline"} >
                      {item.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default addFood;
