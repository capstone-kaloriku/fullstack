import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";

interface SelectFoodProps {
  label: string;
  kalori: number;
  onAdd: (nama: string, kalori: number) => void;
  /** @kevin — prop baru: apakah lauk ini sudah dipilih user */
  isSelected?: boolean;
}

function SelectFood({ label, kalori, onAdd, isSelected = false }: SelectFoodProps) {
  return (
    <Button
      type="button"
      onClick={() => !isSelected && onAdd(label, kalori)}
      disabled={isSelected}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${
        isSelected
          ? "border-emerald-400 bg-emerald-50 text-emerald-600 cursor-default opacity-80"
          : "border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground"
      }`}
    >
      {isSelected ? <Check size={12} /> : <Plus size={12} />}
      {label}
      <span className="opacity-60 ml-0.5">({kalori} kcal)</span>
    </Button>
  );
}

export default SelectFood;
