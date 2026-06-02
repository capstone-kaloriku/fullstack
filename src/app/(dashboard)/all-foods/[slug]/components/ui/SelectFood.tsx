import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SelectFoodProps {
  label: string;
  onAdd: (nama: string) => void;
}

function SelectFood({ label, onAdd }: SelectFoodProps) {
  return (
    <Button
      type="button"
      onClick={() => onAdd(label)}
      className="inline-flex items-center gap-1 rounded-full border border-primary bg-background px-2.5 py-0.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <Plus size={12} />
      {label}
    </Button>
  );
}

export default SelectFood;
