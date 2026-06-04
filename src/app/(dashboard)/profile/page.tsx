import { Card, CardContent } from "@/components/ui/card";
import { User2Icon } from "lucide-react";
import { IoFastFood } from "react-icons/io5";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import Options from "./components/Option";
import { getUserProfile, getTodayConsumption } from "../actions";

const setting = [
  {
    id: 1,
    title: "Pengaturan Akun",
    description: "Profile, email, dan keamanan",
    icon: <User2Icon />,
    url: "/profile/settings",
  },
  {
    id: 2,
    title: "Target Kalori",
    description: "Atur kalori harianmu sesuai kebutuhan",
    icon: <IoFastFood />,
    url: "/profile/target",
  },
];

const Profile = async () => {
  const [data, userData] = await Promise.all([
    getUserProfile(),
    getTodayConsumption(),
  ]);

  const namaUser = data?.namaUser || "User";
  const usia = data?.usia || 0;
  const jenisKelamin = data?.jenisKelamin || "Laki-Laki";
  const beratBadan = data?.beratBadan || 0;
  const tinggiBadan = data?.tinggiBadan || 0;
  const aktivitasFisik = data?.aktivitasFisik || "Ringan";
  const targetKalori = data?.targetKalori || 0;
  const kaloriTerpenuhi = userData?.totals || 0;

  let bmi = 0;
  let bmiStatus = "-";
  if (beratBadan > 0 && tinggiBadan > 0) {
    const tinggiM = tinggiBadan / 100;
    bmi = Number((beratBadan / (tinggiM * tinggiM)).toFixed(1));
    if (bmi < 18.5) {
      bmiStatus = "Kurus";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      bmiStatus = "Normal";
    } else if (bmi >= 25 && bmi <= 29.9) {
      bmiStatus = "Gemuk (Overweight)";
    } else {
      bmiStatus = "Obesitas";
    }
  }

  const progressPercentage =
    targetKalori > 0 && kaloriTerpenuhi.kalori > 0
      ? (kaloriTerpenuhi.kalori / targetKalori) * 100
      : 0;

  return (
    <div className="w-full mx-auto p-6 max-w-2xl lg:max-w-5xl my-6 overflow-x-hidden">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col text-2xl font-extrabold">
            {namaUser}
            <span className="text-sm text-muted-foreground">
              {usia} Tahun, {jenisKelamin}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="flex items-center justify-center bg-secondary-foreground text-secondary text-center p-2">
              <CardContent className="flex flex-col items-center justify-center p-2">
                <span className="text-sm">BMI</span>
                <span className="font-extrabold text-xl">
                  {bmi > 0 ? bmi : "-"}
                </span>
                <span className="text-xs text-secondary/80 mt-1">
                  {bmiStatus}
                </span>
              </CardContent>
            </Card>
            <Card className="flex items-center justify-center bg-primary text-secondary text-center p-2">
              <CardContent className="flex flex-col items-center justify-center p-2">
                <span className="text-sm">Aktivitas</span>
                <span className="font-extrabold text-base mt-1">
                  {aktivitasFisik}
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="w-full my-6">
          <Card className="bg-primary-foreground">
            <CardContent className="flex flex-col gap-3">
              <Progress value={progressPercentage}>
                <ProgressLabel className="text-base font-medium text-primary">
                  Informasi Pribadi
                </ProgressLabel>
                <ProgressValue className="text-base font-medium text-primary" />
              </Progress>
              <div className="flex items-center justify-between font-bold text-muted-foreground text-sm">
                {kaloriTerpenuhi.kalori} Kcal (SEKARANG)
                <span>{targetKalori} Kcal (TARGET)</span>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Options */}
        <Options data={setting} />
      </div>
    </div>
  );
};

export default Profile;
