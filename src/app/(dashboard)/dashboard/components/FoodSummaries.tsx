import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

import { FoodSummariesProps } from "@/types"

type Props = {
  data: FoodSummariesProps[]
}

function FoodSummaries({ data }: Props) {
  return (
    <>
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
        {data.map(({ id, nama, gambar, kalori, karbo, protein, lemak, kategori }) => {
          return (
            <Card key={id}>
              <div className="flex flex-row items-center">
                <div className="pl-6">
                  <Image
                    src={gambar}
                    alt={nama}
                    className="rounded-xl"
                    width={90}
                    height={90}
                  />
                </div>
                <div className="flex flex-col items-start">
                  <CardHeader className="w-full" >
                    <div className="flex flex-row items-center justify-between">
                      <CardTitle className="text-primary text-sm">
                        {kategori.toUpperCase()}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        <span className="text-xl font-extrabold text-secondary-foreground">{kalori}</span> KCAL
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-start gap-3">
                      <h3 className="font-bold text-lg">{nama}</h3>
                      <div className="flex flex-row gap-3">
                        <span className="bg-muted-foreground/25 py-1 px-3 rounded-xl text-muted-foreground">
                          K:{karbo}g
                        </span>
                        <span className="bg-muted-foreground/25 py-1 px-3 rounded-xl text-muted-foreground">
                          P:{protein}g
                        </span>
                        <span className="bg-muted-foreground/25 py-1 px-3 rounded-xl text-muted-foreground">
                          L:{lemak}g
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          )
        })}

      </div>
    </>
  )
}

export default FoodSummaries