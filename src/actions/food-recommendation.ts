"use server";

import { createClient } from "@/lib/supabase/server";

const REKOMENDASI_API_URL =
  process.env.REKOMENDASI_API_URL || "https://web-production-74431.up.railway.app";

// Batas normalisasi kalori (kcal) — makanan Indonesia umumnya max ~1500 kcal/porsi
const MAX_KALORI = 1500;
const MAX_USIA = 80;

export interface FoodRecommendation {
  id: string;
  nama: string;
  gambar: string;
  kalori: number;
  kategori: string;
  slug: string;
  predictedRating: number;
}

// Deteksi kategori protein dari nama makanan (untuk input API rekomendasi)
function detectFoodCategory(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("ayam")) return "ayam";
  if (lower.includes("ikan") || lower.includes("lele") || lower.includes("nila") || lower.includes("tongkol") || lower.includes("salmon")) return "ikan";
  if (lower.includes("tempe")) return "tempe";
  if (lower.includes("tahu")) return "tahu";
  if (lower.includes("telur")) return "telur";
  if (lower.includes("udang")) return "udang";
  if (lower.includes("sapi") || lower.includes("daging")) return "sapi";
  if (lower.includes("kambing")) return "kambing";
  return "lain-lain";
}

// Panggil /predict_rating untuk satu makanan
async function predictRating(
  foodName: string,
  calories: number,
  userAge: number,
): Promise<number> {
  const body = {
    Title_processed: foodName.toLowerCase(),
    Ingredients_processed: foodName.toLowerCase(),
    Steps_processed: "",
    jumlah_kalori_normalized: Math.min(calories / MAX_KALORI, 1),
    usia_normalized: Math.min(userAge / MAX_USIA, 1),
    Food_Category: detectFoodCategory(foodName),
  };

  const res = await fetch(`${REKOMENDASI_API_URL}/predict_rating`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    next: { revalidate: 3600 }, // cache 1 jam
  });

  if (!res.ok) throw new Error(`Rating API error: ${res.status}`);

  const data = await res.json();
  return typeof data.predicted_rating === "number" ? data.predicted_rating : 0;
}

/**
 * Ambil rekomendasi makanan untuk user berdasarkan usia dan predicted rating.
 * Fallback ke random jika API gagal (sesuai saran Kevin).
 */
export async function getFoodRecommendations(limit = 6): Promise<FoodRecommendation[]> {
  const supabase = await createClient();

  // Ambil usia user dari health_profiles
  const { data: { user: authUser } } = await supabase.auth.getUser();
  let userAge = 25; // default

  if (authUser?.id) {
    const { data: health } = await supabase
      .from("health_profiles")
      .select("date_of_birth")
      .eq("user_id", authUser.id)
      .maybeSingle();

    if (health?.date_of_birth) {
      const birth = new Date(health.date_of_birth);
      const today = new Date();
      userAge = today.getFullYear() - birth.getFullYear();
    }
  }

  // Ambil sample makanan dari Supabase (hanya yang verified)
  const { data: foods, error } = await supabase
    .from("food_items")
    .select("food_id, name, calories, category, image_url, slug")
    .limit(30);

  if (error || !foods || foods.length === 0) {
    console.error("[Rekomendasi] Gagal ambil makanan:", error?.message);
    return [];
  }

  // Shuffle untuk variasi (supaya tidak selalu item yang sama yang diproses)
  const shuffled = [...foods].sort(() => Math.random() - 0.5).slice(0, 20);

  try {
    // Panggil predict_rating secara paralel
    const rated = await Promise.all(
      shuffled.map(async (food) => {
        try {
          const rating = await predictRating(food.name, food.calories ?? 0, userAge);
          return { food, rating };
        } catch {
          // Jika satu item gagal, beri rating acak sebagai fallback
          return { food, rating: Math.random() * 3 + 2 };
        }
      }),
    );

    // Sort by rating tertinggi, ambil top N
    const sorted = rated.sort((a, b) => b.rating - a.rating).slice(0, limit);

    return sorted.map(({ food, rating }) => ({
      id: food.food_id as string,
      nama: food.name as string,
      gambar: (food.image_url as string) || "/profile.jpg",
      kalori: (food.calories as number) || 0,
      kategori: (food.category as string) || "",
      slug: (food.slug as string) || "",
      predictedRating: Math.round(rating * 10) / 10,
    }));
  } catch (err) {
    console.error("[Rekomendasi] API gagal, fallback ke random:", err);

    // Fallback: random jika semua gagal (saran Kevin: getData || Math.random())
    return shuffled.slice(0, limit).map((food) => ({
      id: food.food_id as string,
      nama: food.name as string,
      gambar: (food.image_url as string) || "/profile.jpg",
      kalori: (food.calories as number) || 0,
      kategori: (food.category as string) || "",
      slug: (food.slug as string) || "",
      predictedRating: 0,
    }));
  }
}
