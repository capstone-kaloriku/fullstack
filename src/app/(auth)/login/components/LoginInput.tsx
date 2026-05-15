'use client';

import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { FaGoogle } from 'react-icons/fa';
import { EyeClosed, EyeIcon, Loader2, Lock, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { loginUser, loginWithGoogle } from '../actions';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.email('Format email tidak valid'),
  password: z.string().min(8, 'Kata sandi harus minimal 8 karakter'),
});

type FormValues = z.infer<typeof formSchema>;

function LoginInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Show error from auth callback if token exchange failed
  useEffect(() => {
    if (searchParams.get('error') === 'auth_code_error') {
      setServerError('Link tidak valid atau sudah kedaluwarsa. Silakan kirim ulang.');
    }
  }, [searchParams]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setServerError(null);

    try {
      const result = await loginWithGoogle();

      if (result.error) {
        setServerError(result.error);
        return;
      }

      if (result.url) {
        window.location.href = result.url;
        return; // keep loading state while redirecting
      }
    } catch {
      setServerError('Gagal login dengan Google. Coba lagi nanti.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const result = await loginUser(values.email, values.password);

      if (!result.success) {
        setServerError(result.error ?? 'Terjadi kesalahan. Coba lagi nanti.');
        return;
      }

      router.push('/dashboard');
      toast.success('Berhasil masuk!');
    } catch {
      setServerError('Terjadi kesalahan. Coba lagi nanti.');
      toast.error('Gagal masuk. Coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form method="POST" action="" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldSet>
        <FieldGroup>
          {/* Server error banner */}
          {serverError && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3">
              {serverError}
            </div>
          )}

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup className="rounded-full px-4 py-6">
              <InputGroupInput
                id="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
              />
              <InputGroupAddon>
                <Mail size={20} />
              </InputGroupAddon>
            </InputGroup>
            <FieldError id="email-error" errors={[errors.email]} />
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
            <InputGroup className="rounded-full px-4 py-6">
              <InputGroupInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Kata Sandi"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? 'password-error' : undefined
                }
                {...register('password')}
              />
              <InputGroupAddon align="inline-start">
                <Lock size={20} />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="cursor-pointer"
                  aria-label={
                    showPassword
                      ? 'Sembunyikan kata sandi'
                      : 'Tampilkan kata sandi'
                  }
                >
                  {showPassword ? (
                    <EyeIcon size={20} />
                  ) : (
                    <EyeClosed size={20} />
                  )}
                </button>
              </InputGroupAddon>
            </InputGroup>
            <FieldError id="password-error" errors={[errors.password]} />
          </Field>

          <Link
            href="/forgot-password"
            className="text-sm text-secondary-foreground flex justify-end"
          >
            Lupa Password?
          </Link>

          <Button type="submit" className="w-full py-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Masuk...
              </>
            ) : (
              'Masuk'
            )}
          </Button>

          <FieldSeparator className="my-3 h-3 justify-center text-sm text-secondary">
            ATAU MASUK DENGAN
          </FieldSeparator>

          {/* Google login */}
          <Button
            variant="outline"
            className="w-full py-6"
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Menghubungkan...
              </>
            ) : (
              <>
                <FaGoogle size={20} />
                Google
              </>
            )}
          </Button>

          <span className="text-sm md:text-base text-muted-foreground text-center my-4">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="text-primary underline font-medium"
            >
              Daftar Sekarang
            </Link>
          </span>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

export default LoginInput;
