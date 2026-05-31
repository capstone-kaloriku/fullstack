import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

import { FoodSummariesProps } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  data: FoodSummariesProps[];
};

function FoodSummaries({ data }: Props) {
  return (
    <>
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
        {data.map(
          ({
            id,
            nama,
            gambar,
            kalori,
            protein,
            lemak,
            karbo,
            kategori,
            slug,
          }) => {
            return (
              <Card key={id}>
                <div className="flex flex-row items-center">
                  <div className="pl-6">
                    <Image
                      src={gambar}
                      alt={nama}
                      className="rounded-xl"
                      width={90}
                      height={90}
                    />
                  </div>
                  <div className="flex flex-col items-start justify-between w-full ">
                    <CardHeader className="w-full">
                      <div className="flex flex-row items-center justify-between">
                        <CardTitle className="text-primary text-sm">
                          {kategori.toUpperCase()}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          <span className="text-xl font-extrabold text-secondary-foreground">
                            {kalori}
                          </span>{" "}
                          KCAL
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="w-full">
                      <div className="flex flex-col items-start gap-3 w-full">
                        <h2 className="text-base font-bold">{nama}</h2>
                        <div className="flex items-center justify-between w-full">
                          <div className="grid grid-cols-3 items-center gap-2 ">
                            <Badge>K:{karbo}g</Badge>
                            <Badge>P:{protein}g</Badge>
                            <Badge>L:{lemak}g</Badge>
                          </div>
                          <Button
                            nativeButton={false}
                            render={<Link href={"/all-foods/" + slug} />}
                            variant="default"
                            size="sm">
                            <Plus size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            );
          },
        )}
      </div>
    </>
  );
}

export default FoodSummaries;
