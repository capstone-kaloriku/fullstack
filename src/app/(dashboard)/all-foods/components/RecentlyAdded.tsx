"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { RecentlyAddedProps } from "@/types";
import { Clock, Flame, Leaf, Sparkles, Wheat } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function RecentlyAddedSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="size-14 shrink-0 rounded-xl" />
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3 w-1/2 rounded-md" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="relative mb-4">
        <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          <Sparkles className="size-7 text-primary" />
        </div>
        <div className="absolute -top-1 -right-1 size-5 rounded-full bg-primary/20 animate-pulse-soft" />
      </div>
      <p className="text-sm font-semibold text-foreground mb-1">
        Belum ada makanan custom
      </p>
      <p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
        Tambahkan makanan melalui form Custom Food di samping untuk memulai.
      </p>
    </div>
  );
}

function NutriBadge({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${color}`}
          />
        }
      >
        <Icon className="size-3" />
        {value}g
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {label}: {value}g
      </TooltipContent>
    </Tooltip>
  );
}

function FoodRow({
  item,
  index,
}: {
  item: RecentlyAddedProps["items"][number];
  index: number;
}) {
  return (
    <Link
      href={`/all-foods/${item.slug}`}
      className="group block"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-muted/60 group-focus-visible:ring-2 group-focus-visible:ring-ring">
        {/* Image */}
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border/50">
          <Image
            src={item.gambar}
            alt={item.nama}
            fill
            sizes="56px"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <span className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors duration-200">
            {item.nama}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <NutriBadge
              icon={Wheat}
              value={item.karbo}
              label="Karbohidrat"
              color="bg-amber-500/10 text-amber-600"
            />
            <NutriBadge
              icon={Leaf}
              value={item.protein}
              label="Protein"
              color="bg-emerald-500/10 text-emerald-600"
            />
          </div>
        </div>

        {/* Calorie badge */}
        <Badge
          variant="secondary"
          className="shrink-0 tabular-nums font-semibold gap-1"
        >
          <Flame className="size-3 text-primary" />
          {item.kalori}
        </Badge>
      </div>
    </Link>
  );
}

// ── Main component ──
export function RecentlyAdded({ items, isLoading }: RecentlyAddedProps) {
  return (
    <Card
      size="sm"
      className="w-full flex flex-col overflow-hidden border-border/60 flex-1"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
            <Clock className="size-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-base font-bold text-foreground">
              Recently Added
            </CardTitle>
            <CardDescription className="text-xs">
              Makanan custom yang baru ditambahkan
            </CardDescription>
          </div>
        </div>
        {!isLoading && items.length > 0 && (
          <Badge variant="outline" className="self-start mt-1">
            {items.length} item
          </Badge>
        )}
      </CardHeader>

      <Separator />

      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        {isLoading ? (
          <div className="flex flex-col gap-1 p-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <RecentlyAddedSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-0.5 p-2">
              {items?.slice(0, 4).map((item, index) => (
                <FoodRow key={item.id} item={item} index={index} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
