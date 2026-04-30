'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CategoryProps } from '@/types';
import { cn } from '@/lib/utils';

function Category({ data, activeFilter, onFilter }: CategoryProps) {
  return (
    <div className="w-full flex flex-col gap-5 my-6">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">Filter Kategori</span>
        {activeFilter && (
          <button
            onClick={() => onFilter(null)}
            className="text-xs font-semibold text-primary hover:text-primary/80 
                       transition-colors duration-200 
                       px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/15
                       active:scale-95 transform"
          >
            Reset Filter
          </button>
        )}
      </div>
      <div className="w-full flex flex-row items-center justify-around gap-3">
        {data.map((item) => {
          const isActive = activeFilter === item.filterKey;
          return (
            <button
              onClick={() => onFilter(isActive ? null : item.filterKey)}
              className={cn(
                "flex w-5 flex-col items-center text-center justify-center gap-3",
                "group cursor-pointer transition-all duration-300 ease-out"
              )}
              key={item.id}
            >
              <Card
                className={cn(
                  "w-16 h-16 flex items-center justify-center rounded-full border transition-all duration-300 ease-out",
                  isActive
                    ? "border-primary bg-primary/12 shadow-md shadow-primary/20 scale-110 ring-2 ring-primary/30"
                    : "border-gray-300 hover:border-primary/50 hover:bg-primary/5 hover:scale-105 group-hover:shadow-sm"
                )}
              >
                <CardContent
                  className={cn(
                    "transition-transform duration-300",
                    isActive && "scale-110"
                  )}
                >
                  {item.icon}
                </CardContent>
              </Card>
              <span
                className={cn(
                  "text-[13px] font-medium transition-all duration-300",
                  isActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground group-hover:text-foreground/70"
                )}
              >
                {item.title}
              </span>
              {/* Active indicator dot */}
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  isActive
                    ? "bg-primary scale-100 opacity-100"
                    : "bg-transparent scale-0 opacity-0"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Category;