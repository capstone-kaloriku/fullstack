'use server';

import { createClient } from '@/lib/supabase/server';

interface OnboardingData {
  gender: 'laki-laki' | 'perempuan';
  dateOfBirth: string; // ISO date string (YYYY-MM-DD)
  weightKg: number;
  heightCm: number;
  activityLevel: string;
}

interface OnboardingResult {
  success: boolean;
  error?: string;
}

/**
 * Saves the onboarding data for a Google OAuth user.
 * Updates gender in public.users and upserts health_profiles.
 */
export async function completeOnboarding(
  data: OnboardingData,
): Promise<OnboardingResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User tidak ditemukan.' };
  }

  // Update gender in public.users
  const { error: userError } = await supabase
    .from('users')
    .update({ gender: data.gender })
    .eq('user_id', user.id);

  if (userError) {
    return {
      success: false,
      error: 'Gagal menyimpan data pengguna: ' + userError.message,
    };
  }

  // Upsert health_profiles
  const { error: profileError } = await supabase
    .from('health_profiles')
    .upsert(
      {
        user_id: user.id,
        weight_kg: data.weightKg,
        height_cm: data.heightCm,
        date_of_birth: data.dateOfBirth,
        activity_level: data.activityLevel,
      },
      { onConflict: 'user_id' },
    );

  if (profileError) {
    return {
      success: false,
      error: 'Gagal menyimpan profil kesehatan: ' + profileError.message,
    };
  }

  return { success: true };
}
