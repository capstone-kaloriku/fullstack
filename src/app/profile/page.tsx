import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, User2Icon } from "lucide-react";
import { FaClockRotateLeft } from "react-icons/fa6";
import { IoFastFood } from "react-icons/io5";

const setting = [
  {
    id: 1,
    title: "Pengaturan Akun",
    description: "Profile, email, dan keamanan",
    icon: <User2Icon />,
  },
  {
    id: 2,
    title: "Target Kalori",
    description: "2000 kcal / hari",
    icon: <IoFastFood />,
  },
  {
    id: 3,
    title: "Riwayat",
    description: "Lihat riwayat catatan kalori kamu",
    icon: <FaClockRotateLeft />,
  },
  {
    id: 4,
    title: "Bantuan",
    description: "FAQ, dan pusat bantuan",
    icon: <IoFastFood />,
  },
];

const Profile = () => {
  return (
    <div className="w-full mx-auto p-6 max-w-2xl my-6">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col text-2xl font-extrabold">
            Sahrul Batagor
            <span className="text-sm text-muted-foreground">Cowok - 90 KG</span>
          </div>
          <div className="flex">
            <Card className="flex items-center justify-center bg-primary text-secondary">
              <CardContent className="flex flex-col items-center">
                Status
                <span className="font-extrabold text-lg">Aktif</span>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="w-full my-6">
          <Card className="bg-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Informasi Pribadi{" "}
                <span className="text-primary">89% Tercapai</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Progress Bar Ditambahin Nanti */}

              <div className="flex items-center justify-between font-bold text-muted-foreground text-sm">
                109 KG (TARGET) <span>80 KG (SEKARANG)</span>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Settings */}
        <div className="flex flex-col w-full gap-3 my-6">
          {setting.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-muted/10 bg-surface p-4"
            >
              <div className="flex flex-row items-center gap-3">
                {item.icon}
                <div className="flex flex-col items-start justify-center">
                  <span className="text-lg font-bold">{item.title}</span>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <ArrowRightIcon className="text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
