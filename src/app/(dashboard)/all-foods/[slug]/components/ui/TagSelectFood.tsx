import React from 'react';
import SelectFood from './SelectFood';

interface LaukSuggestion {
  nama: string;
  kalori: number;
}

interface TagSelectFoodProps {
  suggestions: LaukSuggestion[];
  onAdd: (nama: string, kalori: number) => void;
}

function TagSelectFood({ suggestions, onAdd }: TagSelectFoodProps) {
  if (suggestions.length === 0) return null;

  return (
    <section className="flex flex-col w-full">
      <div className="mb-3">
        <h3 className="text-sm font-semibold">Isi Lauk</h3>
        <p className="text-xs text-muted-foreground">
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
          />
        ))}
      </div>
    </section>
  );
}

export default TagSelectFood;

