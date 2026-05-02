import { Card, CardContent } from "@/components/ui/card";

import CircleProgressBar from "./components/CircleProgressBar";
import ProgressBarDetail from "./components/ProgressBarDetail";
import ProgressBarPersentage from "./components/ProgressBarPersentage";

import Link from "next/link";
import FoodSummaries from "./components/FoodSummaries";

import { persentageProps } from "@/types";

import Reminder from "./components/Reminder";
import { getUserProfile, getTodayConsumption, getAllFoods } from "../actions";

const calculatePercentage = ({ value, maxValue }: persentageProps) => {
  if (maxValue === 0) return 0;

  const Percentage = (value / maxValue) * 100;

  return Math.min(Percentage, 100);
};

const Dashboard = async () => {
  // Fetch data from Supabase
  const [userProfile, todayConsumption, allFoods] = await Promise.all([
    getUserProfile(),
    getTodayConsumption(),
    getAllFoods(),
  ]);

  // Fallback values if user profile not found
  const kebutuhanHarian = userProfile?.kebutuhanHarian || {
    kalori: 2200,
    protein: 130,
    lemak: 70,
    karbohidrat: 370,
  };

  const konsumsiSaatIni = todayConsumption.totals;

  const maxKcal = kebutuhanHarian.kalori;
  const currentKcal = konsumsiSaatIni.kalori;
  const remainingKcal = maxKcal - currentKcal;

  const daily = Object.entries(konsumsiSaatIni).map(([key, value]) => ({
    name: key,
    value: value,
    maxValue: kebutuhanHarian[key as keyof typeof kebutuhanHarian],
    percentage: calculatePercentage({
      value,
      maxValue: kebutuhanHarian[key as keyof typeof kebutuhanHarian],
    }),
  }));

  // Use today's consumed foods, or fallback to first 4 foods from catalog
  const foods = todayConsumption.logs.length > 0
    ? todayConsumption.logs.slice(0, 4)
    : allFoods.slice(0, 4);

  return (
    <>
      <div className="grid grid-cols-1 items-center justify-center gap-4 px-6 mx-auto overflow-x-hidden w-full max-w-2xl lg:max-w-5xl">
        {/* Hero Section: Circle + Nutrition Cards — side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-around lg:items-center mt-6 gap-8 lg:gap-20">
          {/* Circle Progress */}
          <div className="flex flex-col items-center">
            <CircleProgressBar
              value={currentKcal}
              maxValue={maxKcal}
              className="w-64 h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96"
            >
              <ProgressBarDetail kcal={remainingKcal} target={maxKcal} />
            </CircleProgressBar>
          </div>

          {/* Nutrition Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 justify-between w-full lg:w-full mx-auto mt-0 gap-4 lg:gap-5">
            {daily.map((item, index) => (
              <div className="flex flex-col gap-6 items-center justify-center" key={index}>
                <CircleProgressBar
                  value={item.value}
                  maxValue={item.maxValue}
                  className="relative w-20 h-20 max-w-20 md:w-24 md:h-24 lg:w-28 lg:h-28 lg:max-w-28 mx-auto "
                >
                  <ProgressBarPersentage
                    Percentage={item.percentage.toFixed(0) + "%"}
                  />
                </CircleProgressBar>
                <Card className="w-full lg:w-1/2">
                  <CardContent className="flex flex-col items-center justify-center w-full mx-auto">
                    {item.name.toUpperCase()}
                    <span className="text-sm text-muted-foreground font-medium">
                      {item.value}g
                    </span>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Ringkasan Makanan Hari Ini */}
        <div className="flex flex-col mt-8 gap-6">
          <div className="flex items-center justify-between font-semibold text-base md:text-xl">
            <h2>Ringkasan Makanan Hari Ini</h2>
            <Link
              href="/logs"
              className="text-secondary-foreground text-xs md:text-sm font-bold"
            >
              Lihat Semua
            </Link>
          </div>
          <FoodSummaries data={foods} />
        </div>

        {/* Reminder Drink Water */}
        <div className="w-full mt-8 mb-8">
          <Reminder />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
