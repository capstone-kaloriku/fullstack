"use client";

import { useState } from "react";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Loader2 } from "lucide-react";
import { updateAccountSettings } from "../../../../actions";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  initialData: {
    name: string;
    email: string;
    gender: string;
  };
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData.name,
    gender: initialData.gender,
    password: "",
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
      const res = await updateAccountSettings({
        name: formData.name,
        gender: formData.gender,
        password: formData.password || undefined,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Gagal menyimpan perubahan.");
      } else {
        setSuccessMsg("Profil berhasil diperbarui!");
        setFormData({ ...formData, password: "" }); // Reset password field
        router.refresh(); // Refresh page untuk data baru
      }
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

      <FieldGroup>
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

        <Button type="submit" variant="default" className="text-sm md:text-base w-full mt-4 py-6" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
