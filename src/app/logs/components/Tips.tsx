import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { BiBulb } from 'react-icons/bi'

function Tips() {
  return (
    <>
      <Card className='bg-secondary-foreground'>
        <CardContent >
          <div className="flex flex-col gap-2 items-start justify-center">
            <span className="flex flex-row items-center gap-1.5 text-sm text-secondary"> <BiBulb /> TIPS HARI INI</span>
            <span className="pl-5 text-secondary/80">
              Makan Soto Ayam tanpa nasi dapat menghemat sekitar 200 kalori untuk makan malam nanti
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default Tips