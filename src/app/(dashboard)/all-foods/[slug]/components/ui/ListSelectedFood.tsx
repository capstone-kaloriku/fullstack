import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FoodLogEntry } from '@/types';

function ListSelectedFood({ items, onRemove }: FoodLogEntry) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-4 py-2"
        >
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-primary">{item.nama}</span>
            <span className="text-xs text-muted-foreground">{item.porsi} porsi</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ))}
    </div>
  );
}

export default ListSelectedFood;