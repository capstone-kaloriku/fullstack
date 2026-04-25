import { Card, CardContent, CardFooter } from "@/components/ui/card";

import CircleProgressBar from "./components/CircleProgressBar";
import ProgressBarDetail from "./components/ProgressBarDetail";
import ProgressBarPersentage from "./components/ProgressBarPersentage";

import dummy from "@/data/dummy.json";
import summary from "@/data/dummy-food.json";

import Link from "next/link";
import FoodSummaries from "./components/FoodSummaries";

import { FoodSummariesProps } from "@/types";
import { persentageProps } from "@/types";

import Reminder from "./components/Reminder";

const user = dummy[0];

const { kebutuhanHarian, konsumsiSaatIni } = user;

const maxKcal = kebutuhanHarian.kalori;
const currentKcal = konsumsiSaatIni.kalori;
const remainingKcal = maxKcal - currentKcal;

const calculatePercentage = ({ value, maxValue }: persentageProps) => {
  if (maxValue === 0) return 0;

  const Percentage = (value / maxValue) * 100;

  return Math.min(Percentage, 100);
};

const daily = Object.entries(konsumsiSaatIni).map(([key, value]) => ({
  name: key,
  value: value,
  maxValue: kebutuhanHarian[key as keyof typeof kebutuhanHarian],
  percentage: calculatePercentage({
    value,
    maxValue: kebutuhanHarian[key as keyof typeof kebutuhanHarian],
  }),
}));

const foods: FoodSummariesProps[] = summary.slice(0, 2);

const Dashboard = () => {
  return (
    <>
      <div className="grid grid-cols-1 items-center justify-center gap-4 p-6 mx-auto overflow-hidden">
        <div className="flex flex-col items-center justify-center mt-6">
          <CircleProgressBar
            value={currentKcal}
            maxValue={maxKcal}
            className="w-64 h-64"
          >
            <ProgressBarDetail kcal={remainingKcal} target={maxKcal} />
          </CircleProgressBar>
          <div className="flex flex-row justify-around w-full mx-auto mt-8 gap-4">
            {/* Card */}
            {daily.map((item, index) => (
              <Card key={index}>
                <CardContent>
                  <CircleProgressBar
                    value={item.value}
                    maxValue={item.maxValue}
                    className="relative w-12 h-12w-12 max-w-20 mx-auto"
                  >
                    <ProgressBarPersentage
                      Percentage={item.percentage.toFixed(0) + "%"}
                    />
                  </CircleProgressBar>
                </CardContent>
                <CardFooter className="text-base flex flex-col gap-2 font-bold">
                  {item.name.toUpperCase()}
                  <span className="text-sm text-muted-foreground font-medium">
                    {item.value}g
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Ringkasan Makanan Hari Ini */}
        <div className="flex flex-col mt-8 gap-6">
          <div className="flex items-center justify-between font-semibold text-base md:text-xl">
            <h2>Ringkasan Makanan Hari Ini</h2>
            <Link
              href="/all-foods"
              className="text-secondary-foreground text-xs md:text-sm font-bold"
            >
              Lihat Semua
            </Link>
          </div>
          <FoodSummaries data={foods} />
        </div>

        {/* Reminder Drink Water */}
        <div className="w-full mt-8">
          <Reminder />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
