"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CategoryProps } from "@/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// NOTEEE BUAT GUA SENDIRI INI KOMPONEN BAKAL GAK KEPAKE KALO DI MOBILE SO USE RESPONSIVE AS YOU CAN

function PopularCategory({ data, activeFilter, onFilter }: CategoryProps) {


  return (
    <Card className="w-full flex flex-col gap-5 my-6">
      <CardHeader className="flex flex-col gap-3">
        <main className="grid grid-cols-2 items-center justify-between w-full gap-3">
          <article className="flex flex-col items-center justify-between w-full gap-3">
            <figure className="flex flex-row items-center justify-between w-full">
              <span className="text-xl font-bold text-primary">Kategori Populer</span>
              {activeFilter && (
                <Button
                  onClick={() => onFilter(null)}
                  variant='default'
                >
                  Reset Filter
                </Button>
              )}
            </figure>

            <div className="relative w-full overflow-hidden rounded-xl bg-muted/30 aspect-21/6">
              <Image
                src="/login-screen.jpg"
                alt="Banner kategori populer"
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-cover object-center"
              />
            </div>
          </article>
        </main>
      </CardHeader>
      <CardContent className="grid grid-cols-2 items-center justify-between w-full gap-3">
        <div className="w-full flex flex-wrap items-center justify-center gap-2.5">
          {data.map((item) => {
            const isActive = activeFilter === item.filterKey;
            return (
              <Button
                type="button"

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
        </div>

      </CardContent>
    </Card>
  );
}

export default PopularCategory;
