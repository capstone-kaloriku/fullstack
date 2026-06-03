import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SelectFoodProps {
  label: string;
  kalori: number;
  onAdd: (nama: string, kalori: number) => void;
}

function SelectFood({ label, kalori, onAdd }: SelectFoodProps) {
  return (
    <Button
      type="button"
      onClick={() => onAdd(label, kalori)}
      className="inline-flex items-center gap-1 rounded-full border border-primary bg-background px-2.5 py-0.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <Plus size={12} />
      {label}
      <span className="opacity-60 ml-0.5">({kalori} kcal)</span>
    </Button>
  );
}

export default SelectFood;

