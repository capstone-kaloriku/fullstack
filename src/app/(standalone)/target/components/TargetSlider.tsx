"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VscSettings } from "react-icons/vsc";
import { Slider } from "@/components/ui/slider";
import { SliderControlProps } from "@/types";
import { useState } from "react";

const TargetSlider = ({ data }: SliderControlProps) => {
  const [calories, setCalories] = useState(data.defaultCalories);

  return (
    <>
      <Card className="bg-linear-150 from-white to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <span className="bg-muted-foreground/20 px-4 py-1 rounded-full">
              Target Harian Saat Ini
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-3">
            <span className="text-5xl font-bold text-primary">{calories}</span>
            <span className="text-sm text-muted-foreground">Kalori / Hari</span>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-linear-180 from-white to-secondary-foreground/10">
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <span className="text-base font-semibold">Atur Target Kalori</span>
            <VscSettings size={20} className="text-secondary-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Slider
              value={[calories]}
              onValueChange={(val) => {
                const newVal = Array.isArray(val) ? val[0] : val;
                setCalories(newVal);
              }}
              min={data.min}
              max={data.max}
              step={data.step}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{data.min} kkal</span>
              <span className="font-semibold text-sm text-primary">
                {calories} kkal
              </span>
              <span>{data.max} kkal</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TargetSlider;
