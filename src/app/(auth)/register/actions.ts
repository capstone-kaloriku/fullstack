'use server';

import { createClient } from '@/lib/supabase/server';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  gender: 'laki-laki' | 'perempuan';
  age: number;
  weight: number;
  height: number;
}

interface RegisterResult {
  success: boolean;
  error?: string;
}

export async function registerUser(data: RegisterData): Promise<RegisterResult> {
  const supabase = await createClient();

  // 1. Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.username,
      },
    },
  });

  if (authError) {
    // Handle common Supabase Auth errors
    if (authError.message.includes('already registered')) {
      return { success: false, error: 'Email sudah terdaftar. Silakan gunakan email lain.' };
    }
    return { success: false, error: authError.message };
  }

  if (!authData.user) {
    return { success: false, error: 'Terjadi kesalahan saat mendaftarkan akun.' };
  }

  const userId = authData.user.id;

  // 2. Insert into public.users
  const { error: userError } = await supabase
    .from('users')
    .insert({
      user_id: userId,
      name: data.username,
      email: data.email,
      gender: data.gender,
    });

  if (userError) {
    return { success: false, error: 'Gagal menyimpan data pengguna: ' + userError.message };
  }

  // 3. Insert into public.health_profiles
  const { error: profileError } = await supabase
    .from('health_profiles')
    .insert({
      user_id: userId,
      weight_kg: data.weight,
      height_cm: data.height,
      age: data.age,
    });

  if (profileError) {
    return { success: false, error: 'Gagal menyimpan data profil kesehatan: ' + profileError.message };
  }

  return { success: true };
}
