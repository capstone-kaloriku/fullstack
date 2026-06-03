import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
 * For OAuth users (Google, etc.) who sign in for the first time,
 * we also create a record in `public.users` so they exist in the
 * app's data model.
 *
 * On success the user is sent to /dashboard.
 * On failure the user is sent to /login with an error flag.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/dashboard";

  // Ensure next is a relative path
  if (!next.startsWith("/")) {
    next = "/dashboard";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if this OAuth user already exists in public.users
      // If not, create a record for them (first-time Google sign-in)
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

          // New user — redirect to onboarding to collect health data
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

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }

    console.error(
      "[auth/callback] exchangeCodeForSession error:",
      error.message,
    );
  }

  // Error — redirect to login with error flag
  return NextResponse.redirect(`${origin}/login?error=auth_code_error`);
}
