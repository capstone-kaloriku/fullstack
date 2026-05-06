'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { z } from 'zod';
import { Controller, useForm, type FieldValues, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, differenceInYears } from 'date-fns';
import { id as idLocale } from 'date-fns/locale/id';

import { CalendarIcon, Loader2, Mail, User } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import FormField from './FormField';
import PasswordField from './PasswordField';
import { registerUser } from '../actions';

// ============================================================
// Helpers
// ============================================================

function calculateAge(birthday: Date): number {
  return differenceInYears(new Date(), birthday);
}

// ============================================================
// Schema & Types
// ============================================================

const formSchema = z
  .object({
    gender: z.enum(['laki-laki', 'perempuan'], {
      error: 'Jenis kelamin harus dipilih',
    }),
    weight: z.coerce.number<number>().min(1, 'Berat badan harus diisi'),
    height: z.coerce.number<number>().min(1, 'Tinggi badan harus diisi'),
    birthday: z
      .date({ message: 'Tanggal lahir harus dipilih' })
      .refine((date) => date <= new Date(), 'Tanggal lahir tidak boleh di masa depan')
      .refine((date) => calculateAge(date) >= 1, 'Usia minimal 1 tahun')
      .refine((date) => calculateAge(date) <= 120, 'Usia tidak valid'),
    username: z.string().min(2, 'Nama pengguna harus diisi'),
    email: z.email('Format email tidak valid'),
    password: z.string().min(8, 'Kata sandi harus minimal 8 karakter'),
    confirmPassword: z.string().min(8, 'Konfirmasi kata sandi harus minimal 8 karakter'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Kata sandi dan konfirmasi kata sandi harus sama',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

// ============================================================
// Component
// ============================================================

function RegisterInput() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // Empty string defaults render blank inputs (no "0" shown).
    // z.coerce.number() handles string→number conversion at validation time.
    defaultValues: {
      gender: 'laki-laki',
      weight: '',
      height: '',
      birthday: undefined,
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
        birthday: data.birthday,
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

          {/* Tanggal Lahir — Calendar Popover (from Kevin's feature) */}
          <Controller
            name="birthday"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="birthday">Tanggal Lahir</FieldLabel>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger
                    render={
                      <button
                        id="birthday"
                        type="button"
                        className={cn(
                          'flex items-center w-full rounded-full px-4 py-3.5 border border-input bg-background text-sm ring-offset-background transition-colors',
                          'hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                          !field.value && 'text-muted-foreground',
                        )}
                      />
                    }
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-muted-foreground shrink-0" />
                    <span className="flex-1 text-left">
                      {field.value ? (
                        <>
                          {format(field.value, 'dd MMMM yyyy', {
                            locale: idLocale,
                          })}
                          <span className="ml-2 text-muted-foreground">
                            ({calculateAge(field.value)} tahun)
                          </span>
                        </>
                      ) : (
                        'Pilih tanggal lahir'
                      )}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date: Date | undefined) => {
                        field.onChange(date);
                        setCalendarOpen(false);
                      }}
                      captionLayout="dropdown"
                      defaultMonth={field.value || new Date(2000, 0)}
                      startMonth={new Date(1920, 0)}
                      endMonth={new Date()}
                      disabled={{ after: new Date() }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FieldDescription>
                  {field.value
                    ? `Usia Anda: ${calculateAge(field.value)} tahun`
                    : 'Pilih tanggal lahir untuk menghitung usia'}
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
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
  );
}

export default RegisterInput;
