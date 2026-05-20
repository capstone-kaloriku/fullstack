"use client";

import { useEffect, useState } from "react";
import TargetSlider from "./components/TargetSlider";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Field } from "@/components/ui/field";

import { MdTrendingDown, MdTrendingFlat, MdTrendingUp } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getUserProfile, saveTargetCalories } from "@/app/(dashboard)/actions";
import type { GoalType } from "@/types";

const CALORIES_SLIDER_CONFIG = {
  min: 1000,
  max: 4000,
  step: 50,
  defaultCalories: 2150,
};

const objective = [
  {
    id: 1,
    title: "Turun",
    value: "turun" as GoalType,
    icon: <MdTrendingDown />,
  },
  {
    id: 2,
    title: "Bertahan",
    value: "bertahan" as GoalType,
    icon: <MdTrendingFlat />,
  },
  {
    id: 3,
    title: "Naik",
    value: "naik" as GoalType,
    icon: <MdTrendingUp />,
  },
];

const Target = () => {
  const [calories, setCalories] = useState(CALORIES_SLIDER_CONFIG.defaultCalories);
  const [goalType, setGoalType] = useState<GoalType>("bertahan");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data from user profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getUserProfile();
        if (profile) {
          setCalories(profile.targetKalori);
          setGoalType(profile.goalType);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleSave() {
    setIsSaving(true);
    try {
      const result = await saveTargetCalories({
        targetCalories: calories,
        goalType,
      });

      if (result.success) {
        toast.success("Target kalori berhasil disimpan!");
      } else {
        toast.error(result.error || "Gagal menyimpan target.");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl lg:max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Title and Description */}
          <div className="flex flex-col justify-center items-start gap-4">
            <h1 className="text-3xl lg:text-5xl font-bold text-primary">
              Target Kalori
            </h1>
            <p className="text-base text-muted-foreground">
              Sesuaikan asupan kalori kamu untuk mencapai tujuan energimu.
            </p>
          </div>

          {/* Right Column: Controls */}
          <div className="flex flex-col gap-8 w-full border lg:border-none rounded-2xl lg:rounded-none p-6 lg:p-0">
            {/* Slider Card */}
            <div className="w-full">
              <TargetSlider
                data={CALORIES_SLIDER_CONFIG}
                value={calories}
                onChange={setCalories}
              />
            </div>

            {/* Objective Selection */}
            <div className="flex flex-col gap-4 w-full">
              <span className="text-base font-bold">Proyeksi Tujuan</span>
              <Field>
                <ToggleGroup
                  value={[goalType]}
                  onValueChange={(values) => {
                    const selected = values[0] as GoalType | undefined;
                    if (selected && selected !== goalType) {
                      let adjustment = 0;

                      // Revert previous goal effect
                      if (goalType === "naik") adjustment -= 1000;
                      if (goalType === "turun") adjustment += 1000;

                      // Apply new goal effect
                      if (selected === "naik") adjustment += 1000;
                      if (selected === "turun") adjustment -= 1000;

                      let newCalories = calories + adjustment;

                      // Clamp the value
                      if (newCalories < CALORIES_SLIDER_CONFIG.min) newCalories = CALORIES_SLIDER_CONFIG.min;
                      if (newCalories > CALORIES_SLIDER_CONFIG.max) newCalories = CALORIES_SLIDER_CONFIG.max;

                      setCalories(newCalories);
                      setGoalType(selected);
                    }
                  }}
                  className="flex rounded-2xl items-center justify-center mx-auto w-full"
                  spacing={2}
                >
                  {objective.map((item) => (
                    <ToggleGroupItem
                      key={item.id}
                      value={item.value}
                      className="flex-1 border border-primary aria-pressed:bg-primary aria-pressed:text-secondary"
                      variant={"outline"}
                    >
                      {item.title}
                      <span>{item.icon}</span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>
            </div>

            <Button
              className="w-full mt-2"
              size="lg"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Target"
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Target;
