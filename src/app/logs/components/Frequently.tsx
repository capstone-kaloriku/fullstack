import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import Image from 'next/image'

import { FaPlus } from 'react-icons/fa6'

function Frequently() {
  return (
    <>
      <Card className="py-4 rounded-lg border border-gray-300">
        <CardContent>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-start gap-4">
              <Image src="/profile.jpg" alt="Makanan" className="rounded-full" width={50} height={50} />
              <div className="flex flex-col items-start justify-start gap-[6px]">
                <h1 className="text-base font-bold">Nama Makanan</h1>
                <span className="text-muted-foreground text-xs">
                  1 Porsi (350g)
                </span>
                <span className="bg-muted-foreground/10 px-2 py-1 rounded-full text-[11px] text-secondary-foreground">540kcal</span>
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
    </>
  )
}

export default Frequently