import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { FrequentlyProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

import { FaPlus } from "react-icons/fa6";

function Frequently({ data }: FrequentlyProps) {
  return (
    <>
      {data.map((item) => (
        <Link key={item.id} href={`/all-foods/${item.slug}`}>
          <Card className="py-4 rounded-lg border border-gray-300">
            <CardContent>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center justify-start gap-4">
                  <Image
                    src={item.gambar}
                    alt="Makanan"
                    className="rounded-full"
                    width={50}
                    height={50}
                  />
                  <div className="flex flex-col items-start justify-start gap-[6px]">
                    <h1 className="text-base font-bold">{item.nama}</h1>
                    <span className="text-muted-foreground text-xs">
                      {item.porsi} Porsi - {item.takaranSaji} g
                    </span>
                    <span className="bg-muted-foreground/10 px-2 py-1 rounded-full text-[11px] text-secondary-foreground">
                      {item.kalori} kcal
                    </span>
                  </div>
                </div>
                <div>
                  <Button>
                    <FaPlus size={30} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  );
}

export default Frequently;
