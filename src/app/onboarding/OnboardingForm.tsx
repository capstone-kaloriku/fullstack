'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { z } from 'zod';
import { Controller, useForm, type FieldValues, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, differenceInYears } from 'date-fns';
import { id as idLocale } from 'date-fns/locale/id';

import { CalendarIcon, Loader2 } from 'lucide-react';
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
  InputGroup,
} from '@/components/ui/input-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import FormField from '@/app/(auth)/register/components/FormField';
import { completeOnboarding } from './actions';

// ============================================================
// Constants
// ============================================================

const ACTIVITY_LEVELS = [
  'Sangat Ringan',
  'Ringan',
  'Sedang',
  'Berat',
  'Sangat Berat',
];

// ============================================================
// Helpers
// ============================================================

function calculateAge(birthday: Date): number {
  return differenceInYears(new Date(), birthday);
}

// ============================================================
// Schema & Types
// ============================================================

const formSchema = z.object({
  gender: z.enum(['laki-laki', 'perempuan'], {
    error: 'Jenis kelamin harus dipilih',
  }),
  birthday: z
    .date({ message: 'Tanggal lahir harus dipilih' })
    .refine((date) => date <= new Date(), 'Tanggal lahir tidak boleh di masa depan')
    .refine((date) => calculateAge(date) >= 1, 'Usia minimal 1 tahun')
    .refine((date) => calculateAge(date) <= 120, 'Usia tidak valid'),
  weight: z.coerce.number<number>().min(1, 'Berat badan harus diisi'),
  height: z.coerce.number<number>().min(1, 'Tinggi badan harus diisi'),
  activityLevel: z.string().min(1, 'Tingkat aktivitas harus dipilih'),
});

type FormValues = z.infer<typeof formSchema>;

// ============================================================
// Component
// ============================================================

function OnboardingForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: 'laki-laki',
      weight: '',
      height: '',
      birthday: undefined,
      activityLevel: 'Ringan',
    } as unknown as FormValues,
  });

  const control = form.control as unknown as Control<FieldValues>;

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setServerError(null);

    try {
      const result = await completeOnboarding({
        gender: data.gender,
        dateOfBirth: data.birthday.toISOString().split('T')[0],
        weightKg: data.weight,
        heightCm: data.height,
        activityLevel: data.activityLevel,
      });

      if (!result.success) {
        setServerError(result.error || 'Terjadi kesalahan.');
        return;
      }

      router.push('/dashboard');
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

          {/* Jenis Kelamin */}
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

          {/* Tanggal Lahir */}
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

          {/* Berat & Tinggi Badan */}
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

          {/* Tingkat Aktivitas */}
          <Controller
            name="activityLevel"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="activityLevel">Tingkat Aktivitas</FieldLabel>
                <InputGroup className="rounded-full px-4 py-6">
                  <select
                    id="activityLevel"
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full bg-transparent outline-none focus:ring-0 text-sm"
                  >
                    {ACTIVITY_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </InputGroup>
                <FieldDescription>
                  Pilih tingkat aktivitas fisik harian Anda
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Submit */}
          <Button type="submit" className="w-full py-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              'Mulai Sekarang'
            )}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

export default OnboardingForm;
