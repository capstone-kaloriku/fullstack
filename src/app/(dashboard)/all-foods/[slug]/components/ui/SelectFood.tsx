import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SelectFoodProps {
  // id: string | number;
  label: string;
  // onAdd: (item: { id: string | number; label: string }) => void;
}

// function SelectFood({ id, label, onAdd }: SelectFoodProps) { *NANTI PAKE YANG INI WOK BUAT ONCLICKNYA
function SelectFood({ label }: SelectFoodProps) {
  return (
    <Button
      type="button"
      // onClick={() => onAdd({ id, label })}
      className="inline-flex items-center gap-1 rounded-full border border-input bg-background px-2.5 py-0.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Plus />
      {label}
    </Button>
  )
}

export default SelectFood
