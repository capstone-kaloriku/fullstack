"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SideDish } from "@/types";

interface ListSelectedFoodProps {
  items: SideDish[];
  onRemove: (index: number) => void;
  onChangePorsi: (index: number, newPorsi: number) => void;
}

function ListSelectedFood({ items, onRemove, onChangePorsi }: ListSelectedFoodProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      {items.map((item, index) => (
        <div
          key={`${item.nama}-${index}`}
          className="group flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 transition-all duration-200 hover:border-primary/40 hover:bg-primary/8"
        >
          {/* Info lauk */}
          <div className="flex flex-col min-w-0 flex-1 mr-2">
            <span className="text-sm font-semibold text-primary truncate">
              {item.nama}
            </span>
            <span className="text-xs text-muted-foreground">
              {item.kalori ? `${item.kalori * item.porsi} kcal` : ""}
              {item.porsi > 1 && item.kalori
                ? ` (${item.porsi} × ${item.kalori})`
                : ""}
            </span>
          </div>

          {/* Porsi controls */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (item.porsi <= 1) {
                  onRemove(index);
                } else {
                  onChangePorsi(index, item.porsi - 1);
                }
              }}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
            >
              <Minus size={12} />
            </Button>

            <span className="text-xs font-bold text-primary w-5 text-center tabular-nums">
              {item.porsi}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChangePorsi(index, item.porsi + 1)}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
            >
              <Plus size={12} />
            </Button>

            {/* Divider */}
            <div className="w-px h-4 bg-primary/15 mx-1" />

            {/* Delete */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0 rounded-md transition-colors"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListSelectedFood;