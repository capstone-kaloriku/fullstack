import React from 'react';
import SelectFood from './SelectFood';

interface TagSelectFoodProps {
  suggestions: string[];
  onAdd: (nama: string) => void;
}

function TagSelectFood({ suggestions, onAdd }: TagSelectFoodProps) {
  if (suggestions.length === 0) return null;

  return (
    <section className="flex flex-col w-full">
      <div className="mb-3">
        <h3 className="text-sm font-semibold">Saran Lauk</h3>
        <p className="text-xs text-muted-foreground">
          Klik untuk menambahkan lauk ke daftar.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((nama) => (
          <SelectFood
            key={nama}
            label={nama}
            onAdd={onAdd}
          />
        ))}
      </div>
    </section>
  );
}

export default TagSelectFood;