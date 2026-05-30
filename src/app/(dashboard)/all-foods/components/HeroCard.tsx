"use client";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { CategoryProps } from "@/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// NOTEEE BUAT GUA SENDIRI INI KOMPONEN BAKAL GAK KEPAKE KALO DI MOBILE SO USE RESPONSIVE AS YOU CAN

function HeroCard({ data, activeFilter, onFilter }: CategoryProps) {

  return (
    <Card className="h-full w-full flex flex-col gap-5 my-6">
      <CardHeader className="flex flex-col gap-3">
        <main className="grid grid-cols-2 items-center justify-between w-full gap-3">
          <article className="flex flex-col items-center justify-between w-full gap-3 col-span-2">
            <figure className="flex flex-row items-center justify-between w-full">
              <h1 className="text-2xl font-bold text-primary">Kategori Populer</h1>
              {activeFilter && (
                <Button
                  onClick={() => onFilter(null)}
                  variant='default'
                >
                  Reset Filter
                </Button>
              )}
            </figure>
            <CardDescription className="relative w-full overflow-hidden rounded-xl bg-muted/30 aspect-21/6">
              <Image
                src="/login-screen.jpg"
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
                size="sm"
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

export default HeroCard;
