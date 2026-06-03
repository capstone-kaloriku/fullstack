"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

import { GiWaterDrop } from "react-icons/gi";

const Reminder = () => {
  const TARGET_GLASSES = 8;
  const [currentIntake, setCurrentIntake] = useState(0);

  useEffect(() => {
    const today = new Date().toLocaleDateString("id-ID");
    const storedDataStr = localStorage.getItem("lastIntakeDate");

    if (storedDataStr) {
      try {
        const storedData = JSON.parse(storedDataStr);
        if (storedData.date === today) {
          setCurrentIntake(storedData.count);
        }
      } catch (error) {
        console.error("Failed to parse intake data", error);
      }
    }
  }, []);

  const handleInTake = () => {
    setCurrentIntake((prev) => {
      const newCount = prev + 1;
      const today = new Date().toLocaleDateString("id-ID");
      localStorage.setItem(
        "lastIntakeDate",
        JSON.stringify({ date: today, count: newCount }),
      );
      return newCount;
    });
  };

  return (
    <>
      <Card size="default" className="bg-secondary-foreground h-max">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-primary-foreground">
            <div className="flex flex-row items-center gap-2 text-sm md:text-base lg:text-lg">
              <GiWaterDrop />
              Waktunya Minum !
            </div>
            <p className="text-xs md:text-sm text-secondary">
              Jangan lupa minum air putih ya!
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-2">
          <div className="hidden md:flex md:flex-col gap-3 px-2 text-primary-foreground">
            <h3 className="text-xl md:text-3xl lg:text-4xl text-muted">
              <span className="text-3xl md:text-5xl lg:text-6xl text-primary-foreground">
                {currentIntake}
              </span>{" "}
              / {TARGET_GLASSES}
            </h3>
            <Progress value={(currentIntake / TARGET_GLASSES) * 100} />
            <p className="text-sm md:text-base">
              {currentIntake === TARGET_GLASSES
                ? "Yay! Anda telah mencapai target hidrasi hari ini!"
                : `Tinggal ${TARGET_GLASSES - currentIntake} gelas lagi untuk mencapai hidrasimu hari ini`}
            </p>
            <Button
              size="sm"
              disabled={currentIntake === TARGET_GLASSES}
              className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:text-secondary/80"
              onClick={handleInTake}>
              Catat 250ml
            </Button>
          </div>
          <div className="flex flex-col md:hidden gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6 min-w-0">
              <span className="bg-secondary/20 rounded-2xl p-3">
                <GiWaterDrop className="text-4xl text-secondary shrink-0" />
              </span>
              <div className="min-w-0">
                <CardTitle className="text-lg text-secondary">
                  Waktunya Minum !
                </CardTitle>
                <CardDescription className="mt-1 text-secondary">
                  Jangan lupa minum air putih ya!
                </CardDescription>
              </div>
            </div>
            <Progress value={(currentIntake / TARGET_GLASSES) * 100} />
            <Button
              disabled={currentIntake === TARGET_GLASSES}
              className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:text-secondary/80"
              onClick={handleInTake}>
              Catat 250ml
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Reminder;
