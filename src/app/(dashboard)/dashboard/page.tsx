import { Card, CardContent, CardHeader } from "@/components/ui/card";

import CircleProgressBar from "./components/CircleProgressBar";
import ProgressBarDetail from "./components/ProgressBarDetail";

import Link from "next/link";
import FoodSummaries from "./components/FoodSummaries";

import { persentageProps } from "@/types";

import Reminder from "./components/Reminder";
import { getUserProfile, getTodayConsumption, getAllFoods } from "../actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
    kalori: 2000,
    protein: 130,
    lemak: 70,
    karbohidrat: 370,
  };

  const konsumsiSaatIni = todayConsumption.totals;

  const maxKcal = kebutuhanHarian.kalori;
  const currentKcal = konsumsiSaatIni.kalori;
  const remainingKcal = maxKcal - currentKcal;
  const remainingPercentage = calculatePercentage({ value: currentKcal, maxValue: maxKcal });

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
      <div className="grid grid-cols-1 gap-6 px-4 sm:px-6 lg:px-8 mx-auto w-full max-w-7xl xl:max-w-full">
        {/* Hero Section: Circle + Nutrition Cards — side-by-side on desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-4 items-center md:items-stretch justify-center gap-6 lg:gap-8 mt-6">
          {/* Circle Progress */}
          <Card className="flex flex-col md:flex-row justify-center w-full h-full lg:col-span-3">
            <CardHeader className="hidden md:flex flex-col items-start justify-center w-full space-y-4 md:space-y-5 p-6">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-primary">Statistik Harian</h2>
                <p className="text-muted-foreground">Sisa Kalori Hari ini</p>
              </div>
              <div className="text-xl font-bold">
                <span className="text-3xl md:text-4xl">{remainingKcal}</span> kcal
              </div>
              <div className="text-sm text-muted-foreground max-w-md">
                <p>Kamu sudah memenuhi {remainingPercentage.toFixed(0)}% target harianmu. Pertahankan momentum energinya!</p>
              </div>
              <Button nativeButton={false} render={<Link href="/all-foods" />}>
                <Plus className="mr-2 h-4 w-4" /> Tambah Makan
              </Button>
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-center p-6">
              <CircleProgressBar
                value={currentKcal}
                maxValue={maxKcal}
                className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64"
              >
                <ProgressBarDetail kcal={remainingKcal} target={maxKcal} />
              </CircleProgressBar>
            </CardContent>
          </Card>

          {/* Reminder Desktop Mode*/}
          <div className="hidden lg:flex w-full h-full items-stretch">
            <Reminder />
          </div>

        </div>
        {/* Daily Nutrition Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full mt-4">
          {daily
            .filter((_, index) => index !== 0)
            .map((item, index) => (
              <Card className="w-full" key={index}>
                <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground lg:text-sm">
                      {item.name.toUpperCase()}
                    </p>
                    <div className="text-lg font-bold text-foreground lg:text-xl">
                      {item.value} g
                    </div>
                    <p className="text-xs text-muted-foreground lg:text-sm">
                      {item.percentage.toFixed(0)}% dari target
                    </p>
                  </div>
                  <CircleProgressBar
                    value={item.value}
                    maxValue={item.maxValue}
                    className="relative shrink-0 h-12 w-12 sm:h-14 sm:w-14"
                  />
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Reminder Mobile Mode */}
        <div className="w-full lg:hidden mt-2">
          <Reminder />
        </div>

        {/* Ringkasan Makanan Hari Ini */}
        <div className="flex flex-col gap-4 mt-6 mb-10 md:mb-16">
          <div className="flex items-center justify-between font-semibold text-base md:text-xl">
            <h2>Ringkasan Makanan Hari Ini</h2>
            <Link
              href="/logs"
              className="text-secondary-foreground text-sm font-bold hover:underline"
            >
              Lihat Semua
            </Link>
          </div>
          <FoodSummaries data={foods} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
