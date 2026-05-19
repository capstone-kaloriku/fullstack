"use server";

import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "@/lib/supabase/types";

/**
 * Maps a Supabase food_items row to the frontend FoodSummariesProps shape.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFoodItem(item: any) {
  return {
    id: item.food_id as string,
    nama: (item.name as string) || "",
    gambar: (item.image_url as string) || "/profile.jpg",
    kalori: (item.calories as number) || 0,
    karbo: Number(item.carbs_gram) || 0,
    protein: Number(item.protein_gram) || 0,
    lemak: Number(item.fat_gram) || 0,
    kategori: (item.category as string) || "",
    porsi: (item.portion as number) || 1,
    takaranSaji: (item.base_portion_gram as number) || 0,
    slug: (item.slug as string) || "",
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
  let query = supabase.from("food_items").select("*").order("name");

  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching food items:", error.message);
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
    .from("food_items")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching food by slug:", error.message);
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
    .from("food_items")
    .select("*")
    .eq("category", category)
    .order("name");

  if (error) {
    console.error("Error fetching foods by category:", error.message);
    return [];
  }

  return data.map(mapFoodItem);
}

// ============================================================
// USER & HEALTH PROFILE
// ============================================================

/**
 * Calculate age from date of birth.
 */
function calculateAge(dateOfBirth: string | null): number {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Fetch the current user's profile data (from public.users + health_profiles).
 * Since login is not yet implemented, fetches the first available user.
 */
export async function getUserProfile() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const userId = authUser?.id ?? null;

  if (!userId) {
    return null;
  }

  // Fetch user data
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user:", userError.message);
    return null;
  }

  // Fetch health profile
  const { data: healthData, error: healthError } = await supabase
    .from("health_profiles")
    .select("*")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (healthError) {
    console.error("Error fetching health profile:", healthError.message);
  }

  // Calculate age dynamically from date_of_birth
  const usia = calculateAge(healthData?.date_of_birth ?? null);

  const kebutuhanHarian = calculateDailyNeeds({
    weight: Number(healthData?.weight_kg) || 70,
    height: Number(healthData?.height_cm) || 170,
    age: usia || 25,
    gender: userData.gender || "laki-laki",
    activityLevel: healthData?.activity_level || "Ringan",
  });

  // Target kalori: gunakan custom target jika ada, fallback ke TDEE
  const targetKalori = healthData?.target_calories
    ? Number(healthData.target_calories)
    : kebutuhanHarian.kalori;

  const goalType = (healthData?.goal_type as 'turun' | 'bertahan' | 'naik') || 'bertahan';

  return {
    namaUser: userData.name || "User",
    email: userData.email,
    usia,
    tanggalLahir: (healthData?.date_of_birth as string) || "",
    jenisKelamin: userData.gender || "Laki-Laki",
    beratBadan: Number(healthData?.weight_kg) || 0,
    tinggiBadan: Number(healthData?.height_cm) || 0,
    aktivitasFisik: healthData?.activity_level || "Ringan",
    kebutuhanHarian,
    targetKalori,
    goalType,
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
  if (gender === "laki-laki") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multiplier
  const activityMultipliers: Record<string, number> = {
    "Sangat Ringan": 1.2,
    Ringan: 1.375,
    Sedang: 1.55,
    Berat: 1.725,
    "Sangat Berat": 1.9,
  };

  const multiplier = activityMultipliers[activityLevel] || 1.375;
  const tdee = Math.round(bmr * multiplier);

  return {
    kalori: tdee,
    protein: Math.round((tdee * 0.2) / 4), // 20% of calories, 4 cal/g
    lemak: Math.round((tdee * 0.25) / 9), // 25% of calories, 9 cal/g
    karbohidrat: Math.round((tdee * 0.55) / 4), // 55% of calories, 4 cal/g
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

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  const userId = authUser?.id ?? null;

  if (!userId) {
    return {
      logs: [],
      totals: { kalori: 0, protein: 0, lemak: 0, karbohidrat: 0 },
    };
  }

  // Get today's date range (UTC)
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).toISOString();
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  ).toISOString();

  const { data: logs, error } = await supabase
    .from("consumption_logs")
    .select(
      `
      *,
      food_items (*)
    `,
    )
    .eq("user_id", userId)
    .gte("logged_at", startOfDay)
    .lt("logged_at", endOfDay)
    .order("logged_at", { ascending: false });

  if (error) {
    console.error("Error fetching consumption logs:", error.message);
    return {
      logs: [],
      totals: { kalori: 0, protein: 0, lemak: 0, karbohidrat: 0 },
    };
  }

  // Calculate totals
  let totalKalori = 0;
  let totalProtein = 0;
  let totalLemak = 0;
  let totalKarbo = 0;

  const mappedLogs = (logs || []).map((log) => {
    const food = log.food_items;
    const calories = log.total_calories || food?.calories || 0;
    const portion = Number(log.consumed_portion) || 1;

    totalKalori += calories;
    totalProtein += (Number(food?.protein_gram) || 0) * portion;
    totalLemak += (Number(food?.fat_gram) || 0) * portion;
    totalKarbo += (Number(food?.carbs_gram) || 0) * portion;

    return {
      id: log.log_id,
      nama: food?.name || log.raw_input_text || "Unknown",
      gambar: food?.image_url || "/profile.jpg",
      kalori: calories,
      karbo: Number(food?.carbs_gram) || 0,
      protein: Number(food?.protein_gram) || 0,
      lemak: Number(food?.fat_gram) || 0,
      kategori: log.meal_type || food?.category || "",
      porsi: portion,
      takaranSaji: food?.base_portion_gram || 0,
      slug: food?.slug || "",
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

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  const userId = authUser?.id ?? null;

  if (!userId) {
    return { success: false, error: "User tidak ditemukan." };
  }

  // If foodId is provided, get the food's calories
  let calories = data.totalCalories || 0;
  if (data.foodId && !data.totalCalories) {
    const { data: food } = await supabase
      .from("food_items")
      .select("calories")
      .eq("food_id", data.foodId)
      .single();
    calories = (food?.calories || 0) * data.portion;
  }

  const { error } = await supabase.from("consumption_logs").insert({
    user_id: userId,
    food_id: data.foodId || null,
    raw_input_text: data.rawInputText || null,
    consumed_portion: data.portion,
    meal_type: data.mealType,
    total_calories: calories,
  });

  if (error) {
    return {
      success: false,
      error: "Gagal menyimpan data konsumsi: " + error.message,
    };
  }

  return { success: true };
}

/**
 * Fetch consumption history for a date range.
 * Groups logs by date for timeline display.
 */
export async function getConsumptionHistory(
  startDate: string,
  endDate: string,
) {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  const userId = authUser?.id ?? null;

  if (!userId) {
    return { days: [] };
  }

  // Query logs within the date range
  const { data: logs, error } = await supabase
    .from("consumption_logs")
    .select(
      `
      *,
      food_items (*)
    `,
    )
    .eq("user_id", userId)
    .gte("logged_at", startDate)
    .lt("logged_at", endDate)
    .order("logged_at", { ascending: false });

  if (error) {
    console.error("Error fetching consumption history:", error.message);
    return { days: [] };
  }

  // Group logs by date (YYYY-MM-DD)
  const grouped: Record<
    string,
    {
      date: string;
      logs: ReturnType<typeof mapConsumptionLog>[];
      totalKalori: number;
    }
  > = {};

  for (const log of logs || []) {
    const dateKey = new Date(log.logged_at ?? new Date()).toLocaleDateString(
      "sv-SE",
    ); // YYYY-MM-DD format
    if (!grouped[dateKey]) {
      grouped[dateKey] = { date: dateKey, logs: [], totalKalori: 0 };
    }
    const mapped = mapConsumptionLog(log);
    grouped[dateKey].logs.push(mapped);
    grouped[dateKey].totalKalori += mapped.kalori;
  }

  // Sort by date descending
  const days = Object.values(grouped)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((day) => ({
      ...day,
      totalKalori: Math.round(day.totalKalori),
    }));

  return { days };
}

/**
 * Map a raw consumption_log row to frontend shape.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapConsumptionLog(log: any) {
  const food = log.food_items;
  const calories = log.total_calories || food?.calories || 0;
  const portion = Number(log.consumed_portion) || 1;

  return {
    id: log.log_id as string,
    nama: (food?.name || log.raw_input_text || "Makanan Custom") as string,
    gambar: (food?.image_url || "/profile.jpg") as string,
    kalori: calories as number,
    porsi: portion,
    mealType: (log.meal_type || "") as string,
    loggedAt: log.logged_at as string,
  };
}

/**
 * Delete a single consumption log entry.
 */
export async function deleteConsumptionLog(logId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("consumption_logs")
    .delete()
    .eq("log_id", logId);

  if (error) {
    return { success: false, error: "Gagal menghapus log: " + error.message };
  }

  return { success: true };
}

// ============================================================
// TARGET CALORIES
// ============================================================

/**
 * Save the user's custom calorie target and goal type.
 */
export async function saveTargetCalories(data: {
  targetCalories: number;
  goalType: 'turun' | 'bertahan' | 'naik';
}) {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  const userId = authUser?.id ?? null;

  if (!userId) {
    return { success: false, error: "User tidak ditemukan." };
  }

  const { error } = await supabase
    .from("health_profiles")
    .update({
      target_calories: data.targetCalories,
      goal_type: data.goalType,
    })
    .eq("user_id", userId);

  if (error) {
    return {
      success: false,
      error: "Gagal menyimpan target kalori: " + error.message,
    };
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

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  const userId = authUser?.id ?? null;

  if (!userId) {
    return { success: false, error: "User tidak ditemukan." };
  }

  // Update public.users (name, gender)
  const { error: updateError } = await supabase
    .from("users")
    .update({
      name: data.name,
      gender: data.gender,
    })
    .eq("user_id", userId);

  if (updateError) {
    return {
      success: false,
      error: "Gagal memperbarui profil: " + updateError.message,
    };
  }

  // Update password in Auth if provided (only works if actually logged in)
  if (data.password && authUser) {
    const { error: authError } = await supabase.auth.updateUser({
      password: data.password,
    });
    if (authError) {
      return {
        success: false,
        error:
          "Profil diperbarui, tapi gagal mengubah kata sandi: " +
          authError.message,
      };
    }
  }

  return { success: true };
}

/**
 * Update the current user's health profile (weight, height, date_of_birth, activity_level).
 * Updates the existing row in health_profiles.
 */
export async function updateHealthProfile(data: {
  dateOfBirth?: string;
  weightKg?: number;
  heightCm?: number;
  activityLevel?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  const userId = authUser?.id ?? null;

  if (!userId) {
    return { success: false, error: "User tidak ditemukan." };
  }

  // Build the update payload — only include provided fields
  const updatePayload: TablesUpdate<"health_profiles"> = {
    recorded_at: new Date().toISOString(),
  };

  if (data.dateOfBirth !== undefined) {
    updatePayload.date_of_birth = data.dateOfBirth || null;
  }
  if (data.weightKg !== undefined) {
    updatePayload.weight_kg = data.weightKg;
  }
  if (data.heightCm !== undefined) {
    updatePayload.height_cm = data.heightCm;
  }
  if (data.activityLevel !== undefined) {
    updatePayload.activity_level = data.activityLevel;
  }

  // Calculate BMR and TDEE if we have enough data
  if (data.weightKg && data.heightCm && data.dateOfBirth) {
    const age = calculateAge(data.dateOfBirth);
    // Get gender from users table
    const { data: userData } = await supabase
      .from("users")
      .select("gender")
      .eq("user_id", userId)
      .single();

    const gender = userData?.gender || "laki-laki";
    const needs = calculateDailyNeeds({
      weight: data.weightKg,
      height: data.heightCm,
      age: age || 25,
      gender,
      activityLevel: data.activityLevel || "Ringan",
    });

    updatePayload.bmr = needs.kalori; // Store TDEE as the main calorie target
    updatePayload.tdee = needs.kalori;
  }

  const { error } = await supabase
    .from("health_profiles")
    .upsert(
      { ...updatePayload, user_id: userId },
      { onConflict: "user_id" },
    );

  if (error) {
    return {
      success: false,
      error: "Gagal memperbarui profil kesehatan: " + error.message,
    };
  }

  return { success: true };
}

