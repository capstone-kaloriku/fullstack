import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

// ============================================================
// Route Handler — OAuth callback endpoint
// ============================================================

/**
 * Handles the OAuth callback after the user completes consent
 * on the provider's site (e.g. Google).
 *
 * Supabase redirects here with a `code` query param which we
 * exchange for a session via `exchangeCodeForSession`.
 *
 * ⚠️  IMPORTANT — Cookie handling:
 * We intentionally create the Supabase client inline here (not via
 * createClient from lib/supabase/server.ts) so that session cookies
 * produced by `exchangeCodeForSession` are attached directly to the
 * `NextResponse` redirect we return. Using the implicit Next.js
 * cookie store does NOT work in Route Handlers that return an
 * explicit NextResponse.redirect() — the cookies would be lost and
 * the browser would never receive a session.
 *
 * For OAuth users who sign in for the first time we also create a
 * record in `public.users` and route them to /onboarding.
 *
 * On success  → /dashboard  (or /onboarding for first-time users)
 * On failure  → /login?error=auth_code_error
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  let next = searchParams.get("next") ?? "/dashboard";

  // Diagnostic: log everything received from Supabase
  console.log("[auth/callback] received params:", {
    code: code ? `${code.slice(0, 8)}...` : null,
    error: errorParam,
    error_description: errorDescription,
    allParams: Object.fromEntries(searchParams.entries()),
  });

  // Check PKCE cookie presence
  const cookies = request.cookies.getAll();
  const pkceKey = cookies.find((c) => c.name.includes("code-verifier") || c.name.includes("pkce") || c.name.includes("verifier"));
  console.log("[auth/callback] pkce cookie found:", pkceKey?.name ?? "NONE", "| total cookies:", cookies.length);

  // Guard: ensure next is always a relative path
  if (!next.startsWith("/")) {
    next = "/dashboard";
  }

  // Supabase sent an error (e.g. PKCE mismatch, state mismatch, denied)
  if (errorParam) {
    console.error(`[auth/callback] Supabase error: ${errorParam} — ${errorDescription}`);
    return NextResponse.redirect(new URL("/login?error=auth_code_error", origin));
  }

  // No code → something went wrong upstream
  if (!code) {
    console.error("[auth/callback] No code received from Supabase");
    return NextResponse.redirect(new URL("/login?error=auth_code_error", origin));
  }

  // ------------------------------------------------------------------
  // 1. Create a temporary response to collect cookies from Supabase.
  //    After exchangeCodeForSession runs, Supabase calls setAll() to
  //    write session cookies. We capture them here and transfer them
  //    to the final redirect response so the browser actually receives
  //    the session cookie.
  // ------------------------------------------------------------------
  const cookieCollector = new NextResponse();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write onto the collector so we can transfer them later
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieCollector.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // ------------------------------------------------------------------
  // 2. Exchange the one-time code for a session
  // ------------------------------------------------------------------
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
    return NextResponse.redirect(new URL("/login?error=auth_code_error", origin));
  }

  // ------------------------------------------------------------------
  // 3. Determine redirect target based on user / profile state
  // ------------------------------------------------------------------
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: existingUser } = await supabase
      .from("users")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (!existingUser) {
      // First-time OAuth user — create public.users record
      const name =
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        user.email?.split("@")[0] ??
        "User";

      await supabase.from("users").insert({
        user_id: user.id,
        name,
        email: user.email!,
      });

      // Route new users to onboarding to collect health data
      next = "/onboarding";
    } else {
      // Existing user — check if they have a health profile
      const { data: healthProfile } = await supabase
        .from("health_profiles")
        .select("profile_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!healthProfile) {
        next = "/onboarding";
      }
    }
  }

  // ------------------------------------------------------------------
  // 4. Build the correct base URL (handles Vercel's proxy headers)
  // ------------------------------------------------------------------
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  let baseUrl: string;
  if (isLocalEnv) {
    baseUrl = origin;
  } else if (forwardedHost) {
    baseUrl = `https://${forwardedHost}`;
  } else {
    baseUrl = origin;
  }

  // ------------------------------------------------------------------
  // 5. Return the redirect with session cookies attached
  // ------------------------------------------------------------------
  const redirectResponse = NextResponse.redirect(new URL(next, baseUrl));

  // Transfer every Set-Cookie header from the collector to the redirect
  cookieCollector.headers.getSetCookie().forEach((cookie) => {
    redirectResponse.headers.append("Set-Cookie", cookie);
  });

  return redirectResponse;
}
