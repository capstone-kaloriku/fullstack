'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle } from 'lucide-react';

import {
  FieldGroup,
  FieldSet,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import PasswordField from '@/app/(auth)/register/components/PasswordField';

import { z } from 'zod';
import { useForm, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { resetPassword } from '../actions';

// ============================================================
// Validation schema — hanya password baru + konfirmasi
// ============================================================

const formSchema = z
  .object({
    password: z.string().min(8, 'Kata sandi harus minimal 8 karakter'),
    confirmPassword: z
      .string()
      .min(8, 'Konfirmasi kata sandi harus minimal 8 karakter'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Kata sandi dan konfirmasi kata sandi harus sama',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

// ============================================================
// Component — Reset password form (password + confirm only)
// ============================================================

function ResetPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setServerError(null);

    try {
      const result = await resetPassword(data.password);

      if (!result.success) {
        setServerError(result.error ?? 'Gagal mengatur ulang kata sandi.');
        return;
      }

      // Show success state, then redirect to login
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch {
      setServerError('Terjadi kesalahan. Coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  }

  // ============================================================
  // Success state — password has been reset
  // ============================================================

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <CheckCircle size={28} className="text-primary" />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl font-bold text-secondary-foreground">
            Kata Sandi Diperbarui!
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Kata sandi kamu berhasil diubah. Kamu akan dialihkan ke halaman
            login...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // Form state — input new password + confirm
  // ============================================================

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          {/* Server error banner */}
          {serverError && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3">
              {serverError}
            </div>
          )}

          {/* New password */}
          <PasswordField
            name="password"
            control={form.control as unknown as import('react-hook-form').Control<FieldValues>}
            label="Kata Sandi Baru"
            description="Minimal 8 karakter dengan kombinasi huruf dan angka."
            id="password"
            placeholder="Kata Sandi Baru"
          />

          {/* Confirm password */}
          <PasswordField
            name="confirmPassword"
            control={form.control as unknown as import('react-hook-form').Control<FieldValues>}
            label="Konfirmasi Kata Sandi"
            description="Masukkan ulang kata sandi baru kamu."
            id="confirmPassword"
            placeholder="Konfirmasi Kata Sandi"
          />

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full py-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              'Atur Ulang Kata Sandi'
            )}
          </Button>

          {/* Back to login */}
          <span className="text-sm md:text-base text-muted-foreground text-center my-4">
            Sudah ingat kata sandi?{' '}
            <Link href="/login" className="text-primary underline font-medium">
              Login Sekarang
            </Link>
          </span>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

export default ResetPassword;
