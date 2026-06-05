"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getFoodRecommendations, type FoodRecommendation } from "@/actions/food-recommendation";

function SkeletonCard() {
  return (
    <div className="animate-pulse flex flex-col gap-2">
      <div className="rounded-xl bg-muted h-28 w-full" />
      <div className="h-3 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
    </div>
  );
}

function FoodCard({ food }: { food: FoodRecommendation }) {
  return (
    <Link
      href={`/all-foods/${food.slug}`}
      className="group flex flex-col gap-2 hover:opacity-90 transition-opacity"
    >
      <div className="relative rounded-xl overflow-hidden h-28 w-full bg-muted">
        <Image
          src={food.gambar}
          alt={food.nama}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/profile.jpg";
          }}
        />
      </div>
      <div className="flex flex-col gap-0.5 px-0.5">
        <p className="text-sm font-medium leading-snug line-clamp-1">{food.nama}</p>
        <p className="text-xs text-muted-foreground">{food.kalori} kcal</p>
      </div>
    </Link>
  );
}

export function RecommendedFoods() {
  const [foods, setFoods] = useState<FoodRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFoodRecommendations(6)
      .then(setFoods)
      .catch(() => setFoods([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (!isLoading && foods.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary">Rekomendasi Untukmu</h2>
        <span className="text-xs text-muted-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
          AI
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : foods.map((food) => <FoodCard key={food.id} food={food} />)}
      </div>
    </div>
  );
}
