'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';

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
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';

import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// ============================================================
// Validation schema
// ============================================================

const formSchema = z.object({
  email: z
    .email('Format email tidak valid')
    .min(1, 'Email harus diisi'),
});

type FormValues = z.infer<typeof formSchema>;

// ============================================================
// Component — Forgot password form (input email → send reset link)
// ============================================================

function ForgotPasswordForm() {
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  // True when email has been sent successfully
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle submit — will call Supabase resetPasswordForEmail later
  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setServerError(null);

    try {
      // TODO: Connect to server action / Supabase Auth
      // For now, simulate success after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mark as sent
      setSentEmail(data.email);
      setEmailSent(true);
    } catch {
      setServerError('Terjadi kesalahan. Coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  }

  // ============================================================
  // Success state — email has been sent
  // ============================================================

  if (emailSent) {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        {/* Success icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Mail size={28} className="text-primary" />
        </div>

        {/* Success message */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl font-bold text-secondary-foreground">
            Email Terkirim!
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Kami telah mengirimkan link reset password ke{' '}
            <strong className="text-primary">{sentEmail}</strong>.
            Cek inbox atau folder spam kamu.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full">
          <Button
            variant="outline"
            className="w-full py-6"
            onClick={() => {
              setEmailSent(false);
              form.reset();
            }}
          >
            Kirim Ulang
          </Button>

          <Link
            href="/login"
            className="text-sm text-primary underline font-medium text-center"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================
  // Form state — input email
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

          {/* Email field */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <InputGroup className="rounded-full px-4 py-6">
                  <InputGroupInput
                    id="email"
                    type="email"
                    placeholder="Masukkan email kamu"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  <InputGroupAddon>
                    <Mail size={20} />
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Masukkan email yang terdaftar di akun kamu.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
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
                Mengirim...
              </>
            ) : (
              'Kirim Link Reset'
            )}
          </Button>

          {/* Back to login */}
          <Link
            href="/login"
            className="text-sm text-muted-foreground flex items-center justify-center gap-1 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Kembali ke Login
          </Link>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

export default ForgotPasswordForm;
