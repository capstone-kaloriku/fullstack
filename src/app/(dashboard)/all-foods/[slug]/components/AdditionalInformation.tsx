"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { FaBowlFood } from "react-icons/fa6";

interface AdditionalInformationProps {
  food: {
    id: string;
    nama: string;
    kalori: number;
    gambar?: string;
  };
}

function AdditionalInformation({ food }: AdditionalInformationProps) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    setTime(`${hours}:${minutes}`);
  }, []);

  const perPortionCalories = food.kalori ?? 0;

  return (
    <div className="lg:sticky lg:top-24 lg:self-start w-full flex flex-col items-center justify-start gap-6">
      {/* Food Image */}
      <Card className="w-full py-6">
        <CardContent className="flex flex-col items-center justify-center gap-5">
          <div className="relative w-full aspect-video sm:aspect-[4/3] md:aspect-video overflow-hidden rounded-xl">
            <Image
              src={food.gambar ?? "/profile.jpg"}
              className="object-cover"
              alt="gambar"
              fill
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-xl font-bold">{food.nama}</h2>
            <span className="bg-muted-foreground/20 text-secondary-foreground px-2 py-1.5 rounded-full flex items-center gap-2">
              <FaBowlFood />
              {perPortionCalories} kcal / porsi
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Time */}
      <Card className="w-full py-6">
        <CardHeader className="flex items-center gap-5">
          <FaClock size={18} className="text-primary" />
          <CardTitle className="text-lg font-bold">Jam Makan</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-start gap-5">
          <div className="flex items-center justify-center gap-2 w-full">
            <InputGroup className="px-4 py-6 flex items-center rounded-lg border border-primary text-primary w-full">
              <InputGroupInput
                type="time"
                className="placeholder:text-primary/50 w-full"
                placeholder="Waktu submit otomatis"
                value={time}
                readOnly
              />
            </InputGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdditionalInformation;
