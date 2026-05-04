'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { z } from 'zod';
import { Controller, useForm, type FieldValues, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

<<<<<<< HEAD
import { Loader2, Mail, User } from 'lucide-react';
import { FaBirthdayCake } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import FormField from './FormField';
import PasswordField from './PasswordField';
import { registerUser } from '../actions';

// ============================================================
// Schema & Types
// ============================================================

const formSchema = z
  .object({
    gender: z.enum(['laki-laki', 'perempuan'], {
      error: 'Jenis kelamin harus dipilih',
    }),
    weight: z.coerce.number().min(1, 'Berat badan harus diisi'),
    height: z.coerce.number().min(1, 'Tinggi badan harus diisi'),
    age: z.coerce.number().min(1, 'Usia harus diisi'),
    username: z.string().min(2, 'Nama pengguna harus diisi'),
    email: z.email('Format email tidak valid'),
    password: z.string().min(8, 'Kata sandi harus minimal 8 karakter'),
    confirmPassword: z.string().min(8, 'Konfirmasi kata sandi harus minimal 8 karakter'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Kata sandi dan konfirmasi kata sandi harus sama',
    path: ['confirmPassword'],
  });
=======
import Link from "next/link";
import { useRouter } from "next/navigation";

import { EyeClosed, Eye, Lock, Mail, User, Loader2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaBirthdayCake } from "react-icons/fa";
import { useState } from "react";
import { registerUser } from "../actions";

const formSchema = z.object({
  gender: z.enum(["laki-laki", "perempuan"], { error: "Jenis kelamin harus dipilih" }),
  weight: z.coerce.number().min(1, "Berat badan harus diisi"),
  height: z.coerce.number().min(1, "Tinggi badan harus diisi"),
  age: z.coerce.number().min(1, "Usia harus diisi"),
  username: z.string().min(2, "Nama user harus diisi"),
  email: z.email("Format email tidak valid"),
  password: z.string().min(8, "Kata sandi harus minimal 8 karakter"),
  confirmPassword: z.string().min(8, "Konfirmasi kata sandi harus minimal 8 karakter")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Kata sandi dan konfirmasi kata sandi harus sama",
  path: ["confirmPassword"],
})
>>>>>>> 2bef6c72e57f40d138a5c89b1cfda16b3b07b5b4

type FormValues = z.infer<typeof formSchema>;

// ============================================================
// Component
// ============================================================

function RegisterInput() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
<<<<<<< HEAD
=======
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
>>>>>>> 2bef6c72e57f40d138a5c89b1cfda16b3b07b5b4

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // Empty string defaults render blank inputs (no "0" shown).
    // z.coerce.number() handles string→number conversion at validation time.
    defaultValues: {
      gender: 'laki-laki',
      weight: '',
      height: '',
      age: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    } as unknown as FormValues,
  });

  // Single cast point — avoids repeating cast at each field usage
  const control = form.control as unknown as Control<FieldValues>;

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setServerError(null);

    try {
      const result = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        gender: data.gender,
        age: data.age,
        weight: data.weight,
        height: data.height,
      });

      if (!result.success) {
        setServerError(result.error || 'Terjadi kesalahan saat mendaftar.');
        return;
      }

      // Registration successful — redirect to login
      router.push('/login');
    } catch {
      setServerError('Terjadi kesalahan jaringan. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
<<<<<<< HEAD
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          {/* Server Error Banner */}
          {serverError && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3">
              {serverError}
            </div>
          )}

          {/* Jenis Kelamin — unique UI (ToggleGroup), not using FormField */}
          <Controller
            name="gender"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Jenis Kelamin</FieldLabel>
=======
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setServerError(null);

    try {
      const result = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        gender: data.gender,
        age: data.age,
        weight: data.weight,
        height: data.height,
      });

      if (!result.success) {
        setServerError(result.error || "Terjadi kesalahan saat mendaftar.");
        return;
      }

      // Registration successful — redirect to login
      router.push("/login");
    } catch {
      setServerError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  function onInvalid(errors: unknown) {
    console.log("Formulir kosong", errors)
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
        <FieldSet>
          <FieldGroup>
            {/* Server Error Banner */}
            {serverError && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3">
                {serverError}
              </div>
            )}

            <Controller name="gender" control={form.control} render={({ field, fieldState }) => (
              <Field >
                <FieldLabel htmlFor="gender">Jenis Kelamin</FieldLabel>
>>>>>>> 2bef6c72e57f40d138a5c89b1cfda16b3b07b5b4
                <ToggleGroup
                  value={field.value ? [field.value] : []}
                  onValueChange={(values) => field.onChange(values[0] ?? '')}
                  className="flex rounded-2xl items-center justify-center mx-auto w-full"
                  spacing={2}
                >
                  <ToggleGroupItem
                    value="laki-laki"
                    className="flex-1 border border-primary aria-pressed:bg-primary aria-pressed:text-secondary"
                    variant="outline"
                  >
                    Laki-Laki
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="perempuan"
                    className="flex-1 border border-primary aria-pressed:bg-primary aria-pressed:text-secondary"
                    variant="outline"
                  >
                    Perempuan
                  </ToggleGroupItem>
                </ToggleGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Usia */}
          <FormField
            name="age"
            control={control}
            label="Usia"
            description="Masukkan usia Anda"
            id="age"
            type="number"
            placeholder="Usia"
            icon={<FaBirthdayCake size={20} />}
          />

          {/* Berat & Tinggi Badan — side by side */}
          <div className="grid grid-cols-2 w-full gap-4">
            <FormField
              name="weight"
              control={control}
              label="Berat Badan"
              description="Masukkan berat badan Anda"
              id="weight"
              type="number"
              placeholder="0"
              addonEnd={<span className="text-muted-foreground">KG</span>}
            />
            <FormField
              name="height"
              control={control}
              label="Tinggi Badan"
              description="Masukkan tinggi badan Anda"
              id="height"
              type="number"
              placeholder="0"
              addonEnd={<span className="text-muted-foreground">CM</span>}
            />
          </div>

          {/* Nama Pengguna */}
          <FormField
            name="username"
            control={control}
            label="Nama Pengguna"
            description="Masukkan nama pengguna Anda"
            id="username"
            placeholder="Nama Pengguna"
            icon={<User size={20} />}
          />

          {/* Email */}
          <FormField
            name="email"
            control={control}
            label="Email"
            description="Masukkan email Anda"
            id="email"
            placeholder="Email"
            icon={<Mail size={20} />}
          />

          {/* Kata Sandi */}
          <PasswordField
            name="password"
            control={control}
            label="Kata Sandi"
            description="Masukkan kata sandi minimal 8 karakter"
            id="password"
            placeholder="Kata Sandi"
          />

          {/* Konfirmasi Kata Sandi */}
          <PasswordField
            name="confirmPassword"
            control={control}
            label="Konfirmasi Kata Sandi"
            description="Konfirmasi kata sandi Anda"
            id="confirmPassword"
            placeholder="Konfirmasi Kata Sandi"
          />

<<<<<<< HEAD
          {/* Submit Button */}
          <Button type="submit" className="w-full py-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Mendaftar...
              </>
            ) : (
              'Daftar'
            )}
          </Button>

          {/* Login Link */}
          <span className="text-sm md:text-lg text-muted-foreground text-center my-4">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-primary underline font-medium">
              Login Sekarang
            </Link>
          </span>
        </FieldGroup>
      </FieldSet>
    </form>
=======
                  />
                  <InputGroupAddon align="inline-start">
                    <Lock size={20} />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                      {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                    </button>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>Masukkan kata sandi sebanyak 8 karakter</FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />

            <Controller name="confirmPassword" control={form.control} render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Konfirmasi Password
                </FieldLabel>
                <InputGroup className="rounded-full px-4 py-6">
                  <InputGroupInput
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi Password"
                    {...field}
                  />
                  <InputGroupAddon align="inline-start">
                    <Lock size={20} />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="cursor-pointer">
                      {showConfirmPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                    </button>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>Konfirmasi Password anda</FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />


            <Button type="submit" className="w-full py-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Mendaftar...
                </>
              ) : (
                "Daftar"
              )}
            </Button>

            <span className="text-sm md:text-lg text-muted-foreground text-center my-4">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary underline font-medium">
                Login Sekarang
              </Link>
            </span>
          </FieldGroup>
        </FieldSet >
      </form>
    </>
>>>>>>> 2bef6c72e57f40d138a5c89b1cfda16b3b07b5b4
  );
}

export default RegisterInput;
