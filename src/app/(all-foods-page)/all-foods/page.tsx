import { Card, CardContent } from "@/components/ui/card"
import Header from "./components/Header"

import Image from "next/image"

import { Button } from "@/components/ui/button"
import { FaPlus } from "react-icons/fa6"

import dummyData from "@/data/dummy-frequently.json"

const data = dummyData

const AllFood = () => {
  return (
    <>
      <Header />
      <div className='max-w-xl mx-auto p-6 w-full'>
        <div className="flex flex-col gap-3">
          <h1 className="text-lg font-bold text-primary">Daftar Makanan</h1>
          <div className="flex flex-col items-center w-full gap-6">
            {data.map((item) => (
              <Card className="py-4 rounded-lg border border-gray-300 w-full" key={item.id}>
                <CardContent>
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center justify-start gap-4">
                      <Image src={item.gambar} alt="Makanan" className="rounded-full" width={50} height={50} />
                      <div className="flex flex-col items-start justify-start gap-[6px]">
                        <h1 className="text-base font-bold">{item.nama}</h1>
                        <span className="text-muted-foreground text-xs">
                          {item.porsi} Porsi - {item.takaranSaji} g
                        </span>
                        <span className="bg-muted-foreground/10 px-2 py-1 rounded-full text-[11px] text-secondary-foreground">{item.kalori} kcal</span>
                      </div>
                    </div>
                    <div>
                      <Button >
                        <FaPlus size={30} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div >
    </>
  )
}

export default AllFood