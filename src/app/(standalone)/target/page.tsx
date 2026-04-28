import NavbarStandalone from "../components/NavbarStandalone";
import TargetSlider from "./components/TargetSlider";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Field } from "@/components/ui/field";

import { MdTrendingDown } from "react-icons/md";
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
    icon: <MdTrendingDown />,
  },
  {
    id: 3,
    title: "Naik",
    icon: <MdTrendingDown />,
  },
];

const Target = () => {
  return (
    <>
      <NavbarStandalone>Target</NavbarStandalone>
      <div className="max-w-lg lg:max-w-2xl mx-auto w-full p-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col justify-center items-start gap-3">
            <h1 className="text-3xl font-bold text-primary">Target Kalori</h1>
            <span className="text-sm text-muted-foreground">
              Sesuaikan asupan kalori kamu untuk mencapai tujuan energimu
            </span>
          </div>

          {/* Slider Card */}
          <div className="grid grid-cols-1 items-center justify-center gap-6">
            <TargetSlider data={CALORIES_SLIDER_CONFIG} />
          </div>

          {/* Objective Selection */}
          <div className="flex flex-col items-start gap-6">
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
          <Button>Simpan Target</Button>
        </div>
      </div>
    </>
  );
};

export default Target;
