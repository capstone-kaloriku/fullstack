'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

// ============================================================
// Types
// ============================================================

interface LoginResult {
  success: boolean;
  error?: string;
}

interface OAuthResult {
  url?: string;
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

// ============================================================
// Server Action — Login with Google (OAuth / PKCE)
// ============================================================

/**
 * Initiates Google OAuth sign-in via Supabase Auth (PKCE flow).
 * Returns the provider redirect URL — the client should navigate
 * to it. After consent, Google redirects back to /auth/callback
 * where the code is exchanged for a session.
 */
export async function loginWithGoogle(): Promise<OAuthResult> {
  const supabase = await createClient();
  const origin = (await headers()).get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { url: data.url };
}
