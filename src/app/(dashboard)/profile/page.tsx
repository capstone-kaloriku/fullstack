import { Card, CardContent } from "@/components/ui/card";
import { User2Icon } from "lucide-react";
import { IoFastFood } from "react-icons/io5";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import Options from "./components/Option";
import AccountList from "./components/AccountList";
import { getUserProfile, getAllAccounts } from "../actions";

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
    description: "2000 kcal / hari",
    icon: <IoFastFood />,
    url: "/profile/target",
  },
];

const Profile = async () => {
  // Fetch user profile + all registered accounts in parallel
  const [data, accounts] = await Promise.all([
    getUserProfile(),
    getAllAccounts(),
  ]);


  const namaUser = data?.namaUser || "User";
  const usia = data?.usia || 0;
  const jenisKelamin = data?.jenisKelamin || "Laki-Laki";
  const beratBadan = data?.beratBadan || 0;
  const aktivitasFisik = data?.aktivitasFisik || "Ringan";

  const targetBeratBadan = beratBadan > 0 ? beratBadan - 10 : 0;

  const progressPercentage = beratBadan > 0 && targetBeratBadan > 0
    ? Math.min(Math.round((targetBeratBadan / beratBadan) * 100), 100)
    : 89;

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
          <div className="flex">
            <Card className="flex items-center justify-center bg-primary text-secondary">
              <CardContent className="flex flex-col items-center">
                Aktifitas
                <span className="font-extrabold text-lg">
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
                {targetBeratBadan} KG (TARGET){" "}
                <span>{beratBadan} KG (SEKARANG)</span>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Options */}
        <Options data={setting} />

        {/* Account List — for testing: list all accounts + delete */}
        <AccountList accounts={accounts} />
      </div>
    </div>
  );
};

export default Profile;
