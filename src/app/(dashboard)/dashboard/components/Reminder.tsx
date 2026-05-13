import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { GiWaterDrop } from "react-icons/gi"


const Reminder = () => {
  return (
    <>
      <Card className="bg-secondary-foreground h-full">
        <CardHeader>
          <CardTitle className="text-lg text-primary-foreground">
            <div className="flex flex-row items-center gap-3 text-base md:text-lg lg:text-2xl">
              <GiWaterDrop />
              Waktunya Minum !
            </div>
            <p className="text-sm md:text-lg text-secondary">
              Jangan lupa minum air putih ya!
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-3">
          <div className="hidden md:flex md:flex-col gap-4 px-3 text-primary-foreground">
            <h3 className="text-2xl md:text-4xl lg:text-5xl text-muted"><span className="text-4xl md:text-6xl lg:text-7xl text-primary-foreground">1</span> / 3
            </h3>
            <Progress value={33} />
            <p className="text-lg">Tinggal 2 gelas lagi untuk mencapai hidrasimu hari ini</p>
            <Button className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:text-secondary/80">
              Catat 250ml
            </Button>
          </div>
          <div className="flex flex-col md:hidden gap-4 sm:flex-row sm:items-center sm:justify-between">
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