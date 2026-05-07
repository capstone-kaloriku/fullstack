'use server';

import { createClient } from '@/lib/supabase/server';

// ============================================================
// Types
// ============================================================

interface ResetPasswordResult {
  success: boolean;
  error?: string;
}

// ============================================================
// Server Action — Update user password
// ============================================================

/**
 * Updates the authenticated user's password.
 *
 * This action is called from the reset-password page **after**
 * the user has clicked the recovery link in their email and
 * the token has been exchanged for a session via `/auth/confirm`.
 *
 * The user is already authenticated at this point, so we don't
 * need their email — just the new password.
 */
export async function resetPassword(
  password: string,
): Promise<ResetPasswordResult> {
  // Server-side validation
  if (!password || password.length < 8) {
    return {
      success: false,
      error: 'Kata sandi harus minimal 8 karakter.',
    };
  }

  const supabase = await createClient();

  // Verify the user has a valid session (came from recovery link)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'Sesi tidak valid atau sudah kedaluwarsa. Silakan kirim ulang link reset password.',
    };
  }

  // Update the password
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error('[reset-password] updateUser error:', error.message);

    if (error.message.includes('same_password')) {
      return {
        success: false,
        error: 'Kata sandi baru tidak boleh sama dengan kata sandi lama.',
      };
    }

    return {
      success: false,
      error: 'Gagal mengatur ulang kata sandi. Coba lagi nanti.',
    };
  }

  // Sign out after password reset so user can log in with new password
  await supabase.auth.signOut();

  return { success: true };
}
