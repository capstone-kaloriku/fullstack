import SettingsForm from "./components/SettingsForm";
import { getUserProfile } from "../../../actions";

const Settings = async () => {
  const profile = await getUserProfile();

  const initialData = {
    name: profile?.namaUser || "",
    email: profile?.email || "",
    gender: profile?.jenisKelamin || "laki-laki",
    // Health profile fields
    dateOfBirth: profile?.tanggalLahir || "",
    weightKg: profile?.beratBadan || 0,
    heightCm: profile?.tinggiBadan || 0,
    activityLevel: profile?.aktivitasFisik || "Ringan",
  };

  return (
    <>
      <div className="grid grid-cols-1 w-full mx-auto p-6 max-w-2xl md:max-w-4xl lg:max-w-7xl gap-6">
        <div className="flex flex-col justify-center gap-1.5">
          <h1 className="text-2xl font-bold text-primary">Pengaturan Akun</h1>
          <span className="text-base text-muted-foreground font-medium">
            Kelola preferensi dan data pribadi anda
          </span>
        </div>
        <div>
          <SettingsForm initialData={initialData} />
        </div>
      </div>
    </>
  );
};

export default Settings;

