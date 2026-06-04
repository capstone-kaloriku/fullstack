"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { CategoryProps } from "@/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function FilterCard({ data, activeFilter, onFilter }: CategoryProps) {
  return (
    <Card size="sm" className="w-full flex flex-col gap-5">
      <CardHeader className="flex flex-col gap-3">
        <main className="grid grid-cols-2 items-center justify-between w-full gap-3">
          <article className="flex flex-col items-center justify-between w-full gap-3 col-span-2">
            <figure className="flex flex-row items-center justify-between w-full">
              <h1 className="text-2xl font-bold text-primary">
                Kategori Populer
              </h1>
              {activeFilter && (
                <Button onClick={() => onFilter(null)} variant="default">
                  Reset Filter
                </Button>
              )}
            </figure>
            <CardDescription className="hidden lg:block relative w-full overflow-hidden rounded-xl bg-muted/30 aspect-21/6">
              <Image
                src="/carimakan.jpeg"
                alt="Banner kategori populer"
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-cover object-center"
              />
            </CardDescription>
          </article>
        </main>
      </CardHeader>
      <CardContent className="grid grid-cols-2 items-center justify-between w-full gap-3">
        <article className="w-full flex flex-wrap items-center justify-center gap-2.5 col-span-2">
          {data.map((item) => {
            const isActive = activeFilter === item.filterKey;
            return (
              <Button
                type="button"
                size="xs"
                onClick={() => onFilter(isActive ? null : item.filterKey)}
                variant={isActive ? "default" : "outline"}
                aria-pressed={isActive}
                key={item.id}
              >
                {item.icon}
                {item.title}
              </Button>
            );
          })}
        </article>
      </CardContent>
    </Card>
  );
}

export default FilterCard;
