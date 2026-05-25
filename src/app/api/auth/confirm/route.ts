import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================================
// Route Handler — Auth callback endpoint
// ============================================================

/**
 * Handles the auth callback for email-based flows:
 * - Password recovery  (type=recovery)
 * - Email confirmation (type=email)
 *
 * Supports TWO auth flows:
 *
 * 1. **PKCE flow (default)**: Supabase's server verifies the token
 *    first, then redirects here with a `code` param. We exchange
 *    the code for a session via `exchangeCodeForSession`.
 *
 * 2. **Token hash flow**: If the email template is customized to
 *    link directly to this endpoint with `token_hash` & `type`,
 *    we call `verifyOtp` to establish the session.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  const supabase = await createClient();

  // Build redirect URL
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  // Clean up auth params from the redirect URL
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('type');
  redirectTo.searchParams.delete('next');
  redirectTo.searchParams.delete('code');

  // ----------------------------------------------------------
  // Flow 1: PKCE — exchange auth code for session (default)
  // ----------------------------------------------------------
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(redirectTo);
    }

    console.error('[auth/confirm] exchangeCodeForSession error:', error.message);
  }

  // ----------------------------------------------------------
  // Flow 2: Token Hash — verify OTP directly
  // ----------------------------------------------------------
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      return NextResponse.redirect(redirectTo);
    }

    console.error('[auth/confirm] verifyOtp error:', error.message);
  }

  // ----------------------------------------------------------
  // Error — redirect to login with error message
  // ----------------------------------------------------------
  redirectTo.pathname = '/login';
  redirectTo.searchParams.set('error', 'auth_code_error');
  return NextResponse.redirect(redirectTo);
}
