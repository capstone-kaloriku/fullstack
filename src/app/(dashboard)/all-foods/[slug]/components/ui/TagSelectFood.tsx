import React from 'react'
import SelectFood from './SelectFood'
import { FoodLogEntry } from '@/types'

function TagSelectFood({ data }: FoodLogEntry) {
  return (
    <section className="flex flex-col w-full mt-4">
      <div className="mb-4">
        <h3 className="text-base font-semibold">Saran Tambahan</h3>
        <p className="text-sm text-muted-foreground">
          Berikut adalah beberapa saran tambahan yang bisa kamu tambahkan ke dalam makanan ini.
        </p>
      </div>
      {/* Gunakan flex-wrap di parent, dan petakan item di dalamnya */}
      <div className="flex flex-wrap gap-2 mb-4">
        {data.map((item) => (
          <SelectFood
            key={item.id}
            label={item.label}
          />
        ))}
      </div>
    </section>
  )
}

export default TagSelectFood