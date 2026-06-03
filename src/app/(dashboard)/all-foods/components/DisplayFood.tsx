import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FaPlus } from "react-icons/fa6";

import { FrequentlyProps } from "@/types";
import Link from "next/link";

const DisplayFood = ({ data }: FrequentlyProps) => {
  return (
    <>
      {data.map((item) => (
        <Link
          key={item.id}
          href={"/all-foods/" + item.slug}
          className="block w-full"
        >
          <Card className="w-full aspect-square gap-0 rounded-lg border border-gray-300 p-0">
            <CardContent className="flex h-full flex-col p-3">
              <div className="relative w-full flex-1 overflow-hidden rounded-md bg-muted">
                <Image
                  src={item.gambar}
                  alt={item.nama}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold leading-snug">
                    {item.nama}
                  </h2>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.porsi} Porsi - {item.takaranSaji} g
                  </p>
                  <span className="mt-2 inline-flex w-fit rounded-full bg-muted-foreground/10 px-2 py-1 text-[11px] text-secondary-foreground">
                    {item.kalori} kcal
                  </span>
                </div>
                <Button size="icon-sm" className="shrink-0">
                  <FaPlus className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  );
};

export default DisplayFood;
