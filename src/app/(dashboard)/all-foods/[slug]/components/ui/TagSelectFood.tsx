import SelectFood from "./SelectFood";
import { BsStars } from "react-icons/bs";

interface LaukSuggestion {
  nama: string;
  kalori: number;
}

interface TagSelectFoodProps {
  suggestions: LaukSuggestion[];
  onAdd: (nama: string, kalori: number) => void;
  selectedNames?: string[];
}

function TagSelectFood({
  suggestions,
  onAdd,
  selectedNames = [],
}: TagSelectFoodProps) {
  if (suggestions.length === 0) return null;

  return (
    <section className="flex flex-col w-full">
      <div className="mb-3">
        <h3 className="text-md font-semibold flex items-center gap-2 text-primary">
          Tambahan Lauk <BsStars size={16} />
        </h3>
        <p className="text-sm text-muted-foreground">
          Klik untuk menambahkan lauk ke daftar.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((item) => (
          <SelectFood
            key={item.nama}
            label={item.nama}
            kalori={item.kalori}
            onAdd={onAdd}
            isSelected={selectedNames.some(
              (n) => n.toLowerCase() === item.nama.toLowerCase(),
            )}
          />
        ))}
      </div>
    </section>
  );
}

export default TagSelectFood;
