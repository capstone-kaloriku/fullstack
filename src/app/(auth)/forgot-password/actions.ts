'use server';

import { createClient } from '@/lib/supabase/server';

// ============================================================
// Types
// ============================================================

interface ForgotPasswordResult {
  success: boolean;
  error?: string;
}

// ============================================================
// Server Action — Send password-reset email
// ============================================================

/**
 * Sends a password-reset email via Supabase Auth.
 *
 * The email contains a link that points to `/auth/confirm` with
 * `type=recovery` and `next=/reset-password`, so the user is
 * redirected to the reset-password page after token exchange.
 */
export async function sendPasswordResetEmail(
  email: string,
): Promise<ForgotPasswordResult> {
  // Basic server-side validation
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Format email tidak valid.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=/reset-password`,
  });

  if (error) {
    // Don't leak whether the email exists or not — always show success.
    // But log the error server-side for debugging.
    console.error('[forgot-password] resetPasswordForEmail error:', error.message);

    // If it's a rate-limit error, tell the user.
    if (error.status === 429) {
      return {
        success: false,
        error: 'Terlalu banyak permintaan. Coba lagi dalam beberapa menit.',
      };
    }

    // For all other errors, still return success for security
    // (prevents email enumeration attacks).
  }

  return { success: true };
}
