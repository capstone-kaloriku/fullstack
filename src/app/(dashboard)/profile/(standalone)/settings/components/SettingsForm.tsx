"use client";

import { useState } from "react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Loader2 } from "lucide-react";
import { updateAccountSettings, updateHealthProfile } from "../../../../actions";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  initialData: {
    name: string;
    email: string;
    gender: string;
    // Health profile
    dateOfBirth: string;
    weightKg: number;
    heightCm: number;
    activityLevel: string;
  };
}

const ACTIVITY_LEVELS = [
  "Sangat Ringan",
  "Ringan",
  "Sedang",
  "Berat",
  "Sangat Berat",
];

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData.name,
    gender: initialData.gender,
    password: "",
    // Health profile
    dateOfBirth: initialData.dateOfBirth,
    weightKg: initialData.weightKg || "",
    heightCm: initialData.heightCm || "",
    activityLevel: initialData.activityLevel,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Update account settings (name, gender, password)
      const accountRes = await updateAccountSettings({
        name: formData.name,
        gender: formData.gender,
        password: formData.password || undefined,
      });

      if (!accountRes.success) {
        setErrorMsg(accountRes.error || "Gagal menyimpan pengaturan akun.");
        return;
      }

      // Update health profile (dateOfBirth, weight, height, activity)
      const healthRes = await updateHealthProfile({
        dateOfBirth: formData.dateOfBirth || undefined,
        weightKg: formData.weightKg ? Number(formData.weightKg) : undefined,
        heightCm: formData.heightCm ? Number(formData.heightCm) : undefined,
        activityLevel: formData.activityLevel,
      });

      if (!healthRes.success) {
        setErrorMsg(healthRes.error || "Gagal menyimpan profil kesehatan.");
        return;
      }

      setSuccessMsg("Profil berhasil diperbarui!");
      setFormData({ ...formData, password: "" });
      router.refresh();
    } catch {
      setErrorMsg("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {successMsg && (
        <div className="rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 text-sm px-4 py-3 mb-4">
          ✅ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 mb-4">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <FieldGroup className="space-y-4">
          <div className="mb-2">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Pengaturan Akun</h3>
            <p className="text-sm text-muted-foreground">Kelola informasi dasar akun Anda.</p>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup className="py-6 bg-muted/50">
              <InputGroupInput
                id="email"
                type="email"
                value={initialData.email}
                disabled
                className="p-6 cursor-not-allowed"
              />
            </InputGroup>
            <span className="text-xs text-muted-foreground mt-1">Email tidak dapat diubah.</span>
          </Field>

          <Field>
            <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
            <InputGroup className="py-6">
              <InputGroupInput
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="p-6"
                required
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="gender">Jenis Kelamin</FieldLabel>
            <InputGroup className="py-6 px-4">
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-transparent outline-none focus:ring-0 text-sm py-2"
                required
              >
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Kata Sandi Baru (Opsional)</FieldLabel>
            <InputGroup className="py-6">
              <InputGroupInput
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Kosongkan jika tidak ingin mengubah"
                className="p-6"
              />
            </InputGroup>
          </Field>
        </FieldGroup>

        <FieldGroup className="space-y-4">
          <div className="mb-2">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Profil Kesehatan</h3>
            <p className="text-sm text-muted-foreground">Perbarui data kesehatan untuk hasil yang lebih akurat.</p>
          </div>

          <Field>
            <FieldLabel htmlFor="dateOfBirth">Tanggal Lahir</FieldLabel>
            <InputGroup className="py-6">
              <InputGroupInput
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="p-6"
              />
            </InputGroup>
            <span className="text-xs text-muted-foreground mt-1">
              Usia dihitung otomatis dari tanggal lahir.
            </span>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="weightKg">Berat Badan (KG)</FieldLabel>
              <InputGroup className="py-6">
                <InputGroupInput
                  id="weightKg"
                  name="weightKg"
                  type="number"
                  value={formData.weightKg}
                  onChange={handleChange}
                  placeholder="0"
                  className="p-6"
                  min={20}
                  max={300}
                  step={0.1}
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="heightCm">Tinggi Badan (CM)</FieldLabel>
              <InputGroup className="py-6">
                <InputGroupInput
                  id="heightCm"
                  name="heightCm"
                  type="number"
                  value={formData.heightCm}
                  onChange={handleChange}
                  placeholder="0"
                  className="p-6"
                  min={50}
                  max={250}
                  step={0.1}
                />
              </InputGroup>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="activityLevel">Tingkat Aktivitas</FieldLabel>
            <InputGroup className="py-6 px-4">
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full bg-transparent outline-none focus:ring-0 text-sm py-2"
              >
                {ACTIVITY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </InputGroup>
          </Field>
        </FieldGroup>

        <div className="lg:col-span-2 pt-6">
          <Button type="submit" variant="default" className="text-sm md:text-base w-full md:w-auto md:min-w-[200px] md:float-right py-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
