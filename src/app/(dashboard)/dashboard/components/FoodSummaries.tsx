"use client";

import Image from "next/image";
import Link from "next/link";
import { IconFlame, IconClock } from "@tabler/icons-react";
import type { SideDish } from "@/types";
import { BiFoodMenu } from "react-icons/bi";

// Types

export interface TodayFoodEntry {
  id: string | number;
  nama: string;
  gambar: string;
  kalori: number;
  karbo?: number;
  protein?: number;
  lemak?: number;
  kategori?: string;
  porsi?: number;
  takaranSaji?: number;
  slug?: string;
  sideDishes?: SideDish[];
}

interface FoodSummariesProps {
  data: TodayFoodEntry[];
}

// Meal type badge styling

const MEAL_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Pagi: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-400",
  },
  Siang: {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-400",
  },
  Malam: {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-300",
    dot: "bg-indigo-400",
  },
  Camilan: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-400",
  },
};

const DEFAULT_MEAL_STYLE = {
  bg: "bg-muted/50",
  text: "text-muted-foreground",
  dot: "bg-muted-foreground/50",
};

function getMealStyle(mealType?: string) {
  if (!mealType) return DEFAULT_MEAL_STYLE;
  return MEAL_STYLES[mealType] || DEFAULT_MEAL_STYLE;
}

// Empty State
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/40 py-14 px-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted/60">
        <BiFoodMenu className="size-7 text-muted-foreground/40" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">
          Belum ada makanan hari ini
        </p>
        <p className="text-xs text-muted-foreground">
          Catat makananmu untuk memantau asupan kalori harian.
        </p>
      </div>
      <Link
        href="/all-foods"
        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
      >
        + Tambah Makanan
      </Link>
    </div>
  );
}

// Food Card
function FoodCard({ food }: { food: TodayFoodEntry }) {
  const style = getMealStyle(food.kategori);

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
      {/* Food image */}
      <div className="relative size-12 shrink-0 overflow-hidden rounded-xl ring-1 ring-border/50">
        <Image
          src={food.gambar}
          alt={food.nama}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="48px"
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <span className="truncate text-sm font-semibold leading-tight text-foreground">
            {food.nama}
          </span>
          {/* Kalori */}
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-orange-50 px-2 py-0.5 dark:bg-orange-950/40">
            <IconFlame className="size-3 text-orange-500" />
            <span className="text-xs font-bold tabular-nums text-orange-600 dark:text-orange-400">
              {food.kalori}
            </span>
            <span className="text-[10px] text-orange-500/70">kcal</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Meal type badge */}
          {food.kategori && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${style.bg} ${style.text}`}
            >
              <span className={`size-1.5 rounded-full ${style.dot}`} />
              {food.kategori}
            </span>
          )}

          {/* Porsi */}
          {food.porsi && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              <IconClock className="size-2.5" />
              {food.porsi}× porsi
            </span>
          )}

          {/* Side dishes */}
          {food.sideDishes &&
            food.sideDishes.length > 0 &&
            food.sideDishes.map((lauk, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full border border-primary/10 bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary"
              >
                {lauk.nama}
                {lauk.porsi > 1 ? ` (${lauk.porsi}×)` : ""}
              </span>
            ))}
        </div>

        {/* Macros row */}
        {(food.protein != null || food.karbo != null || food.lemak != null) && (
          <div className="flex items-center gap-3 pt-0.5">
            {food.protein != null && (
              <span className="text-[10px] tabular-nums text-muted-foreground">
                <span className="font-semibold text-blue-500">
                  {Math.round(food.protein * (food.porsi ?? 1))}g
                </span>{" "}
                protein
              </span>
            )}
            {food.karbo != null && (
              <span className="text-[10px] tabular-nums text-muted-foreground">
                <span className="font-semibold text-amber-500">
                  {Math.round(food.karbo * (food.porsi ?? 1))}g
                </span>{" "}
                karbo
              </span>
            )}
            {food.lemak != null && (
              <span className="text-[10px] tabular-nums text-muted-foreground">
                <span className="font-semibold text-rose-500">
                  {Math.round(food.lemak * (food.porsi ?? 1))}g
                </span>{" "}
                lemak
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Main Component

export default function FoodSummaries({ data }: FoodSummariesProps) {
  const totalKalori = data.reduce((sum, food) => sum + (food.kalori ?? 0), 0);
  const hasData = data.length > 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Summary bar */}
      {hasData && (
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-2.5 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg bg-primary/8 px-3 py-1.5 border border-primary/10">
              <IconFlame className="size-4 text-primary" />
              <span className="text-sm font-bold tabular-nums text-primary">
                {totalKalori.toLocaleString("id-ID")}
              </span>
              <span className="text-xs text-primary/70">kcal dikonsumsi</span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {data.length} item makanan
          </span>
        </div>
      )}

      {/* Food list */}
      {!hasData ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {data.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}
