import TargetSlider from "./components/TargetSlider";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Field } from "@/components/ui/field";

import { MdTrendingDown, MdTrendingFlat, MdTrendingUp } from "react-icons/md";
import { Button } from "@/components/ui/button";

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
    icon: <MdTrendingDown />,
  },
  {
    id: 2,
    title: "Bertahan",
    icon: <MdTrendingFlat />,
  },
  {
    id: 3,
    title: "Naik",
    icon: <MdTrendingUp />,
  },
];

const Target = () => {
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
              <TargetSlider data={CALORIES_SLIDER_CONFIG} />
            </div>

            {/* Objective Selection */}
            <div className="flex flex-col gap-4 w-full">
              <span className="text-base font-bold">Proyeksi Tujuan</span>
              <Field>
                <ToggleGroup
                  className="flex rounded-2xl items-center justify-center mx-auto w-full"
                  spacing={2}
                >
                  {objective.map((item) => (
                    <ToggleGroupItem
                      key={item.id}
                      value={item.title.toLowerCase()}
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

            <Button className="w-full mt-2" size="lg">Simpan Target</Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Target;
