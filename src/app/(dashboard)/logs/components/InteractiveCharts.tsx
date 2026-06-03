"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/lib/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { getCalorieChartData } from "@/app/(dashboard)/actions"

const chartConfig = {
  calories: {
    label: "Kalori",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function InteractiveCharts() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartData, setChartData] = React.useState<{ date: string; calories: number }[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const handleToggleChange = (value: string[]) => {
    if (value.length > 0) setTimeRange(value[0])
  }

  React.useEffect(() => {
    getCalorieChartData(90).then((data) => {
      setChartData(data)
      setLoading(false)
    })
  }, [])

  const filteredData = React.useMemo(() => {
    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    else if (timeRange === "7d") daysToSubtract = 7

    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return chartData.filter((item) => new Date(item.date) >= startDate)
  }, [chartData, timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Asupan Kalori Harian</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total kalori harian selama {timeRange === "90d" ? "3 bulan" : timeRange === "30d" ? "30 hari" : "7 hari"} terakhir
          </span>
          <span className="@[540px]/card:hidden">
            {timeRange === "90d" ? "3 bulan" : timeRange === "30d" ? "30 hari" : "7 hari"} terakhir
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            value={[timeRange]}
            onValueChange={handleToggleChange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">3 Bulan</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 Hari</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 Hari</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={(v) => v && setTimeRange(v)}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Pilih rentang waktu"
            >
              <SelectValue placeholder="3 Bulan" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">3 Bulan</SelectItem>
              <SelectItem value="30d" className="rounded-lg">30 Hari</SelectItem>
              <SelectItem value="7d" className="rounded-lg">7 Hari</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            Memuat data...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            Belum ada data kalori untuk periode ini.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-calories)" stopOpacity={1.0} />
                  <stop offset="95%" stopColor="var(--color-calories)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("id-ID", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("id-ID", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="calories"
                type="natural"
                fill="url(#fillCalories)"
                stroke="var(--color-calories)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
