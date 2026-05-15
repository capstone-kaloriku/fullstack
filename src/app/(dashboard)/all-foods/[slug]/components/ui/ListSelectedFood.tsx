import Image from 'next/image'
import { FoodLogEntry } from '@/types'

function ListSelectedFood({ data }: FoodLogEntry) {
  return (
    <>
      {data.map((item) => (
        <div key={item.id} className="flex gap-4 mb-4">
          <section className="flex flex-row gap-3 bg-card inset-shadow-sm ring-1 ring-border rounded-xl p-6 w-full">
            <div className="flex flex-items-center justify-center">
              <Image src="/profile.jpg" alt="Selected Food" width={50} height={50} />
            </div>
            <div className="flex flex-col items-start justify-center">
              <h3 className="text-primary">{item.label}</h3>
              <p className="text-muted-foreground">{item.jumlah} {item.jenisTakaran}</p>
            </div>
          </section>
        </div>
      ))}
    </>
  )
}

export default ListSelectedFood