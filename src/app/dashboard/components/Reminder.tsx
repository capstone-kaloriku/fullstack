import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"

import { GiWaterDrop } from "react-icons/gi"


const Reminder = () => {
  return (
    <>
      <Card className="bg-secondary-foreground">
        <CardContent className="px-4 py-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6 min-w-0">
              <span className="bg-secondary/20 rounded-2xl p-3">
                <GiWaterDrop className="text-4xl text-secondary shrink-0" />
              </span>
              <div className="min-w-0">
                <CardTitle className="text-lg text-secondary">Waktunya Minum !</CardTitle>
                <CardDescription className="mt-1 text-secondary">
                  Jangan lupa minum air putih ya!
                </CardDescription>
              </div>
            </div>
            <Button className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:text-secondary/80">
              Catat 250ml
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default Reminder