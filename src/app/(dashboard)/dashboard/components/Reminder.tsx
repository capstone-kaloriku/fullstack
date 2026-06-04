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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState, useCallback } from "react";

import { GiWaterDrop } from "react-icons/gi";
import { AlertTriangle } from "lucide-react";

// Minimum interval between drinks (in milliseconds) — 10 minutes
const MIN_DRINK_INTERVAL_MS = 10 * 60 * 1000;

interface IntakeData {
  date: string;
  count: number;
  timestamps: number[]; // epoch ms of each drink
}

const Reminder = () => {
  const TARGET_GLASSES = 8;
  const [currentIntake, setCurrentIntake] = useState(0);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [showFrequentAlert, setShowFrequentAlert] = useState(false);
  const [recentWarningDismissed, setRecentWarningDismissed] = useState(false);

  useEffect(() => {
    const today = new Date().toLocaleDateString("id-ID");
    const storedDataStr = localStorage.getItem("lastIntakeDate");

    if (storedDataStr) {
      try {
        const storedData: IntakeData = JSON.parse(storedDataStr);
        if (storedData.date === today) {
          setCurrentIntake(storedData.count);
          setTimestamps(storedData.timestamps || []);
        }
      } catch (error) {
        console.error("Failed to parse intake data", error);
      }
    }
  }, []);

  const saveIntake = useCallback(
    (newCount: number, newTimestamps: number[]) => {
      const today = new Date().toLocaleDateString("id-ID");
      const data: IntakeData = {
        date: today,
        count: newCount,
        timestamps: newTimestamps,
      };
      localStorage.setItem("lastIntakeDate", JSON.stringify(data));
    },
    []
  );

  const recordDrink = useCallback(() => {
    const now = Date.now();
    setCurrentIntake((prev) => {
      const newCount = prev + 1;
      const newTimestamps = [...timestamps, now];
      setTimestamps(newTimestamps);
      saveIntake(newCount, newTimestamps);
      setRecentWarningDismissed(false);
      return newCount;
    });
  }, [timestamps, saveIntake]);

  const handleInTake = () => {
    const now = Date.now();
    const lastTimestamp = timestamps.length > 0 ? timestamps[timestamps.length - 1] : 0;
    const timeSinceLastDrink = now - lastTimestamp;

    // If user drank less than MIN_DRINK_INTERVAL_MS ago, show warning
    if (lastTimestamp > 0 && timeSinceLastDrink < MIN_DRINK_INTERVAL_MS) {
      setShowFrequentAlert(true);
      return;
    }

    recordDrink();
  };

  const handleConfirmDrink = () => {
    setShowFrequentAlert(false);
    setRecentWarningDismissed(true);
    recordDrink();
  };

  // Check if the last drink was recent (for showing inline Alert)
  const lastTimestamp = timestamps.length > 0 ? timestamps[timestamps.length - 1] : 0;
  const timeSinceLastDrink = lastTimestamp > 0 ? Date.now() - lastTimestamp : Infinity;
  const isRecentDrink = timeSinceLastDrink < MIN_DRINK_INTERVAL_MS && !recentWarningDismissed && timestamps.length >= 2;

  const minutesAgo = lastTimestamp > 0 ? Math.floor(timeSinceLastDrink / 60000) : 0;

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

            {/* Inline Alert for frequent drinking */}
            {isRecentDrink && (
              <Alert variant="destructive" className="border-amber-400/40 bg-amber-950/60 text-amber-200">
                <AlertTriangle className="text-amber-400" />
                <AlertTitle className="text-amber-200">
                  Minum terlalu sering!
                </AlertTitle>
                <AlertDescription className="text-amber-300/80">
                  Kamu baru minum {minutesAgo < 1 ? "kurang dari 1" : minutesAgo} menit yang lalu. Beri jeda minimal 10 menit agar tubuh menyerap air dengan baik.
                </AlertDescription>
              </Alert>
            )}

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

            {/* Inline Alert for frequent drinking (mobile) */}
            {isRecentDrink && (
              <Alert variant="destructive" className="border-amber-400/40 bg-amber-950/60 text-amber-200">
                <AlertTriangle className="text-amber-400" />
                <AlertTitle className="text-amber-200">
                  Minum terlalu sering!
                </AlertTitle>
                <AlertDescription className="text-amber-300/80">
                  Kamu baru minum {minutesAgo < 1 ? "kurang dari 1" : minutesAgo} menit yang lalu. Beri jeda minimal 10 menit.
                </AlertDescription>
              </Alert>
            )}

            <Button
              disabled={currentIntake === TARGET_GLASSES}
              className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:text-secondary/80"
              onClick={handleInTake}>
              Catat 250ml
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AlertDialog for confirming drink when too frequent */}
      <AlertDialog open={showFrequentAlert} onOpenChange={setShowFrequentAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Minum Terlalu Sering</AlertDialogTitle>
            <AlertDialogDescription>
              Kamu baru saja minum air{" "}
              <strong className="text-foreground">
                {minutesAgo < 1 ? "kurang dari 1" : minutesAgo} menit yang lalu
              </strong>
              . Minum air terlalu sering dalam waktu berdekatan bisa menyebabkan hiponatremia (kelebihan cairan). Sebaiknya beri jeda minimal 10 menit.
              <br /><br />
              Apakah kamu tetap ingin mencatat minum air sekarang?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tunggu Dulu</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmDrink}
            >
              <AlertTriangle data-icon="inline-start" />
              Tetap Catat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Reminder;
