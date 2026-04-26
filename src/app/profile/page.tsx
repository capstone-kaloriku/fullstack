import { Card, CardContent } from "@/components/ui/card";
import { User2Icon } from "lucide-react";
import { FaClockRotateLeft } from "react-icons/fa6";
import { IoFastFood } from "react-icons/io5";
import profileData from "@/data/dummyUserData.json"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import Options from "./components/Option";

const setting = [
  {
    id: 1,
    title: "Pengaturan Akun",
    description: "Profile, email, dan keamanan",
    icon: <User2Icon />,
    url: "/profile/setting",
  },
  {
    id: 2,
    title: "Target Kalori",
    description: "2000 kcal / hari",
    icon: <IoFastFood />,
    url: "/profile/target",
  },
  {
    id: 3,
    title: "Riwayat",
    description: "Lihat riwayat catatan kalori kamu",
    icon: <FaClockRotateLeft />,
    url: "/profile/history",
  },
  {
    id: 4,
    title: "Bantuan",
    description: "FAQ, dan pusat bantuan",
    icon: <IoFastFood />,
    url: "/profile/help",
  },
];

const data = profileData[0];

const Profile = () => {
  return (
    <div className="w-full mx-auto p-6 max-w-2xl my-6">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col text-2xl font-extrabold">
            {data.namaUser}
            <span className="text-sm text-muted-foreground">{data.usia} Tahun, {data.jenisKelamin}</span>
          </div>
          <div className="flex">
            <Card className="flex items-center justify-center bg-primary text-secondary">
              <CardContent className="flex flex-col items-center">
                Aktifitas
                <span className="font-extrabold text-lg">{data.aktivitasFisik}</span>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="w-full my-6">
          <Card className="bg-primary-foreground">
            <CardContent className="flex flex-col gap-3">
              <Progress value={89}>
                <ProgressLabel className="text-base font-medium text-primary">
                  Informasi Pribadi
                </ProgressLabel>
                <ProgressValue className="text-base font-medium text-primary" />
              </Progress>
              <div className="flex items-center justify-between font-bold text-muted-foreground text-sm">
                {data.targetBeratBadan} KG (TARGET) <span>{data.beratBadan} KG (SEKARANG)</span>
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
