'use server';

import { createClient } from '@/lib/supabase/server';

// ============================================================
// Types
// ============================================================

interface LoginResult {
  success: boolean;
  error?: string;
}

// ============================================================
// Server Action — Login with email & password
// ============================================================

/**
 * Authenticates a user with email and password via Supabase Auth.
 * Returns a success/error result — the session cookie is set
 * automatically by the Supabase SSR client.
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Map common errors to user-friendly messages
    if (error.message.includes('Invalid login credentials')) {
      return { success: false, error: 'Email atau kata sandi salah.' };
    }
    if (error.message.includes('Email not confirmed')) {
      return { success: false, error: 'Email belum dikonfirmasi. Cek inbox kamu.' };
    }
    if (error.status === 429) {
      return { success: false, error: 'Terlalu banyak percobaan. Coba lagi nanti.' };
    }

    return { success: false, error: error.message };
  }

  return { success: true };
}
