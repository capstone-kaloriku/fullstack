'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Maps a Supabase food_items row to the frontend FoodSummariesProps shape.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFoodItem(item: any) {
  return {
    id: item.food_id as string,
    nama: (item.name as string) || '',
    gambar: (item.image_url as string) || '/profile.jpg',
    kalori: (item.calories as number) || 0,
    karbo: Number(item.carbs_gram) || 0,
    protein: Number(item.protein_gram) || 0,
    lemak: Number(item.fat_gram) || 0,
    kategori: (item.category as string) || '',
    porsi: (item.portion as number) || 1,
    takaranSaji: (item.base_portion_gram as number) || 0,
    slug: (item.slug as string) || '',
  };
}

// ============================================================
// FOOD ITEMS
// ============================================================

/**
 * Fetch all food items from Supabase.
 */
export async function getAllFoods(searchQuery?: string) {
  const supabase = await createClient();
  let query = supabase.from('food_items').select('*').order('name');

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching food items:', error.message);
    return [];
  }

  return data.map(mapFoodItem);
}

/**
 * Fetch a single food item by slug.
 */
export async function getFoodBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching food by slug:', error.message);
    return null;
  }

  return mapFoodItem(data);
}

/**
 * Fetch food items filtered by category.
 */
export async function getFoodsByCategory(category: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .eq('category', category)
    .order('name');

  if (error) {
    console.error('Error fetching foods by category:', error.message);
    return [];
  }

  return data.map(mapFoodItem);
}

// ============================================================
// USER & HEALTH PROFILE
// ============================================================

/**
 * Fetch the current user's profile data (from public.users + health_profiles).
 * Since login is not yet implemented, fetches the first available user.
 */
export async function getUserProfile() {
  const supabase = await createClient();

  // Try to get logged-in user first
  const { data: { user: authUser } } = await supabase.auth.getUser();

  let userId: string | null = null;

  if (authUser) {
    userId = authUser.id;
  } else {
    // Fallback: get first user (development mode)
    const { data: firstUser } = await supabase
      .from('users')
      .select('user_id')
      .limit(1)
      .single();
    userId = firstUser?.user_id || null;
  }

  if (!userId) {
    return null;
  }

  // Fetch user data
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (userError) {
    console.error('Error fetching user:', userError.message);
    return null;
  }

  // Fetch health profile
  const { data: healthData, error: healthError } = await supabase
    .from('health_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single();

  if (healthError) {
    console.error('Error fetching health profile:', healthError.message);
  }

  return {
    namaUser: userData.name || 'User',
    email: userData.email,
    usia: healthData?.age || 0,
    jenisKelamin: userData.gender || 'Laki-Laki',
    beratBadan: Number(healthData?.weight_kg) || 0,
    tinggiBadan: Number(healthData?.height_cm) || 0,
    aktivitasFisik: healthData?.activity_level || 'Ringan',
    // Calculate daily needs based on BMR (Mifflin-St Jeor)
    kebutuhanHarian: calculateDailyNeeds({
      weight: Number(healthData?.weight_kg) || 70,
      height: Number(healthData?.height_cm) || 170,
      age: healthData?.age || 25,
      gender: userData.gender || 'laki-laki',
      activityLevel: healthData?.activity_level || 'Ringan',
    }),
  };
}

/**
 * Calculate daily nutritional needs using Mifflin-St Jeor equation.
 */
function calculateDailyNeeds(params: {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
}) {
  const { weight, height, age, gender, activityLevel } = params;

  // BMR calculation (Mifflin-St Jeor)
  let bmr: number;
  if (gender === 'laki-laki') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multiplier
  const activityMultipliers: Record<string, number> = {
    'Sangat Ringan': 1.2,
    'Ringan': 1.375,
    'Sedang': 1.55,
    'Berat': 1.725,
    'Sangat Berat': 1.9,
  };

  const multiplier = activityMultipliers[activityLevel] || 1.375;
  const tdee = Math.round(bmr * multiplier);

  return {
    kalori: tdee,
    protein: Math.round(tdee * 0.2 / 4), // 20% of calories, 4 cal/g
    lemak: Math.round(tdee * 0.25 / 9), // 25% of calories, 9 cal/g
    karbohidrat: Math.round(tdee * 0.55 / 4), // 55% of calories, 4 cal/g
  };
}

// ============================================================
// CONSUMPTION LOGS
// ============================================================

/**
 * Fetch today's consumption logs for the current user.
 */
export async function getTodayConsumption() {
  const supabase = await createClient();

  // Get user
  const { data: { user: authUser } } = await supabase.auth.getUser();
  let userId: string | null = authUser?.id || null;

  if (!userId) {
    const { data: firstUser } = await supabase
      .from('users')
      .select('user_id')
      .limit(1)
      .single();
    userId = firstUser?.user_id || null;
  }

  if (!userId) {
    return { logs: [], totals: { kalori: 0, protein: 0, lemak: 0, karbohidrat: 0 } };
  }

  // Get today's date range (UTC)
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

  const { data: logs, error } = await supabase
    .from('consumption_logs')
    .select(`
      *,
      food_items (*)
    `)
    .eq('user_id', userId)
    .gte('logged_at', startOfDay)
    .lt('logged_at', endOfDay)
    .order('logged_at', { ascending: false });

  if (error) {
    console.error('Error fetching consumption logs:', error.message);
    return { logs: [], totals: { kalori: 0, protein: 0, lemak: 0, karbohidrat: 0 } };
  }

  // Calculate totals
  let totalKalori = 0;
  let totalProtein = 0;
  let totalLemak = 0;
  let totalKarbo = 0;

  const mappedLogs = (logs || []).map((log) => {
    const food = log.food_items;
    const calories = log.total_calories || (food?.calories || 0);
    const portion = Number(log.consumed_portion) || 1;

    totalKalori += calories;
    totalProtein += (Number(food?.protein_gram) || 0) * portion;
    totalLemak += (Number(food?.fat_gram) || 0) * portion;
    totalKarbo += (Number(food?.carbs_gram) || 0) * portion;

    return {
      id: log.log_id,
      nama: food?.name || log.raw_input_text || 'Unknown',
      gambar: food?.image_url || '/profile.jpg',
      kalori: calories,
      karbo: Number(food?.carbs_gram) || 0,
      protein: Number(food?.protein_gram) || 0,
      lemak: Number(food?.fat_gram) || 0,
      kategori: log.meal_type || food?.category || '',
      porsi: portion,
      takaranSaji: food?.base_portion_gram || 0,
      slug: food?.slug || '',
    };
  });

  return {
    logs: mappedLogs,
    totals: {
      kalori: Math.round(totalKalori),
      protein: Math.round(totalProtein),
      lemak: Math.round(totalLemak),
      karbohidrat: Math.round(totalKarbo),
    },
  };
}

/**
 * Log a food consumption entry.
 */
export async function logFoodConsumption(data: {
  foodId?: string;
  rawInputText?: string;
  portion: number;
  mealType: string;
  totalCalories?: number;
}) {
  const supabase = await createClient();

  // Get user
  const { data: { user: authUser } } = await supabase.auth.getUser();
  let userId: string | null = authUser?.id || null;

  if (!userId) {
    const { data: firstUser } = await supabase
      .from('users')
      .select('user_id')
      .limit(1)
      .single();
    userId = firstUser?.user_id || null;
  }

  if (!userId) {
    return { success: false, error: 'User tidak ditemukan.' };
  }

  // If foodId is provided, get the food's calories
  let calories = data.totalCalories || 0;
  if (data.foodId && !data.totalCalories) {
    const { data: food } = await supabase
      .from('food_items')
      .select('calories')
      .eq('food_id', data.foodId)
      .single();
    calories = (food?.calories || 0) * data.portion;
  }

  const { error } = await supabase
    .from('consumption_logs')
    .insert({
      user_id: userId,
      food_id: data.foodId || null,
      raw_input_text: data.rawInputText || null,
      consumed_portion: data.portion,
      meal_type: data.mealType,
      total_calories: calories,
    });

  if (error) {
    return { success: false, error: 'Gagal menyimpan data konsumsi: ' + error.message };
  }

  return { success: true };
}

// ============================================================
// SETTINGS / PROFILE UPDATE
// ============================================================

export async function updateAccountSettings(data: {
  name: string;
  gender: string;
  password?: string;
}) {
  const supabase = await createClient();

  // Get user
  const { data: { user: authUser } } = await supabase.auth.getUser();
  let userId: string | null = authUser?.id || null;

  if (!userId) {
    const { data: firstUser } = await supabase
      .from('users')
      .select('user_id')
      .limit(1)
      .single();
    userId = firstUser?.user_id || null;
  }

  if (!userId) {
    return { success: false, error: 'User tidak ditemukan.' };
  }

  // Update public.users (name, gender)
  const { error: updateError } = await supabase
    .from('users')
    .update({
      name: data.name,
      gender: data.gender,
    })
    .eq('user_id', userId);

  if (updateError) {
    return { success: false, error: 'Gagal memperbarui profil: ' + updateError.message };
  }

  // Update password in Auth if provided (only works if actually logged in)
  if (data.password && authUser) {
    const { error: authError } = await supabase.auth.updateUser({
      password: data.password
    });
    if (authError) {
      return { success: false, error: 'Profil diperbarui, tapi gagal mengubah kata sandi: ' + authError.message };
    }
  }

  return { success: true };
}
