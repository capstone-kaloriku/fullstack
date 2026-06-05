"use server";

// import Groq from "groq-sdk"; // dinonaktifkan — pakai Railway food search
import { fetchIndoBERT } from "@/lib/indobert-api";
import { createClient } from "@/lib/supabase/server";
import { uploadFoodImage } from "./upload-image";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! }); // dinonaktifkan

export interface AIValidationResult {
  isValid: boolean;
  nama: string;
  deskripsi: string;
  calories: number;
  protein_gram: number;
  carbs_gram: number;
  fat_gram: number;
  base_portion_gram: number;
  category: string;
  confidence: number;
  alasan?: string;
}

interface RailwayFoodDetail {
  found: boolean;
  data: Record<string, unknown> | null;
}

interface RailwayFoodSearch {
  results: Record<string, unknown>[];
  total: number;
}

// Mapping kategori Railway → kategori lokal
const CATEGORY_ALIASES: Record<string, string> = {
  makanan_berat: "makanan_berat",
  makanan_ringan: "makanan_ringan",
  camilan: "camilan",
  minuman: "minuman",
  snack: "camilan",
  drink: "minuman",
  main: "makanan_berat",
};

function normalizeCategory(raw: unknown): string {
  if (typeof raw !== "string") return "makanan_berat";
  return CATEGORY_ALIASES[raw.toLowerCase().trim()] ?? "makanan_berat";
}

function safeNumber(val: unknown, fallback = 0): number {
  const n = Number(val);
  return isNaN(n) ? fallback : Math.round(n);
}

function mapRailwayDataToResult(
  data: Record<string, unknown>,
  foodName: string,
): AIValidationResult {
  return {
    isValid: true,
    nama: String(data.name ?? data.nama ?? foodName),
    deskripsi: String(
      data.description ??
      data.deskripsi ??
      `${String(data.name ?? foodName)} adalah makanan dengan kandungan gizi yang tercatat dalam knowledge base KaloriKu.`,
    ),
    calories: safeNumber(data.calories ?? data.kalori),
    protein_gram: safeNumber(data.protein_gram ?? data.protein),
    carbs_gram: safeNumber(data.carbs_gram ?? data.carbs ?? data.karbohidrat),
    fat_gram: safeNumber(data.fat_gram ?? data.fat ?? data.lemak),
    base_portion_gram: safeNumber(data.base_portion_gram ?? data.portion_gram, 100),
    category: normalizeCategory(data.category ?? data.kategori),
    confidence: 90,
  };
}

// 1. Validasi makanan via Railway food search (ganti Groq)

export async function validateFoodWithAI(
  foodName: string,
  _imageUrl?: string,
): Promise<{ success: boolean; data?: AIValidationResult; error?: string }> {
  if (!foodName || foodName.trim().length < 2) {
    return { success: false, error: "Nama makanan terlalu pendek." };
  }

  const trimmed = foodName.trim().toLowerCase();

  try {
    // Coba exact match dulu
    const detail = await fetchIndoBERT<RailwayFoodDetail>(
      `/api/food/${encodeURIComponent(trimmed)}`,
    );

    if (detail.found && detail.data) {
      return { success: true, data: mapRailwayDataToResult(detail.data, foodName) };
    }

    // Fallback ke fuzzy search
    const search = await fetchIndoBERT<RailwayFoodSearch>(
      `/api/food/search?q=${encodeURIComponent(trimmed)}&limit=1`,
    );

    if (search.total > 0 && search.results[0]) {
      return { success: true, data: mapRailwayDataToResult(search.results[0], foodName) };
    }

    // Tidak ditemukan di knowledge base
    return {
      success: true,
      data: {
        isValid: false,
        nama: foodName,
        deskripsi: "",
        calories: 0,
        protein_gram: 0,
        carbs_gram: 0,
        fat_gram: 0,
        base_portion_gram: 0,
        category: "makanan_berat",
        confidence: 0,
        alasan: `"${foodName}" tidak ditemukan di knowledge base. Coba nama lain atau periksa ejaan.`,
      },
    };
  } catch (error) {
    console.error("[CustomFood] Validasi gagal:", error);
    return {
      success: false,
      error: "Gagal memvalidasi makanan. Pastikan koneksi ke server AI tersedia.",
    };
  }
}

// ── validateFoodWithGroq — dinonaktifkan ──
// Ganti ke Railway food search di atas.
/*
export async function validateFoodWithGroq(foodName: string, imageUrl?: string) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Kamu adalah asisten validasi makanan Indonesia yang sangat akurat.
Tugasmu: menerima nama makanan dari user, lalu memvalidasi dan mengembalikan estimasi nutrisi.

ATURAN:
1. Jika input BUKAN makanan yang valid (misalnya benda acak, kata tidak jelas), set "isValid" = false dan jelaskan di "alasan".
2. Jika input makanan valid, estimasi nutrisi per 1 porsi standar.
3. Tentukan kategori makanan: "makanan_berat", "makanan_ringan", "minuman", atau "camilan".
4. Berikan confidence score (0-100) seberapa yakin kamu dengan estimasi nutrisi.
5. Porsi standar dalam gram (base_portion_gram).

Keluarkan output HANYA dalam format JSON yang valid:
{
  "isValid": true,
  "nama": "Nasi Goreng",
  "deskripsi": "Nasi yang digoreng dengan bumbu kecap, bawang, dan telur",
  "calories": 550,
  "protein_gram": 12,
  "carbs_gram": 75,
  "fat_gram": 22,
  "base_portion_gram": 250,
  "category": "makanan_berat",
  "confidence": 85,
  "alasan": null
}`,
      },
      {
        role: "user",
        content: `Validasi makanan berikut: "${foodName.trim()}"${imageUrl ? `\nGambar: ${imageUrl}` : ""}`,
      },
    ],
    model: "llama-3.1-8b-instant",
    max_tokens: 400,
    response_format: { type: "json_object" },
  });
  const content = chatCompletion.choices[0]?.message?.content;
  if (!content) return { success: false, error: "Response AI kosong." };
  return { success: true, data: JSON.parse(content) as AIValidationResult };
}
*/

// 2. Simpan custom food ke database

export async function saveCustomFood(data: {
  nama: string;
  calories: number;
  protein_gram: number;
  carbs_gram: number;
  fat_gram: number;
  base_portion_gram: number;
  category: string;
  image_url?: string;
}): Promise<{ success: boolean; foodId?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return { success: false, error: "User tidak ditemukan." };

    const slug = data.nama
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 60);

    const { data: inserted, error } = await supabase
      .from("food_items")
      .insert({
        name: data.nama,
        slug: `${slug}-${Date.now()}`,
        calories: data.calories,
        protein_gram: data.protein_gram,
        carbs_gram: data.carbs_gram,
        fat_gram: data.fat_gram,
        base_portion_gram: data.base_portion_gram,
        category: data.category,
        image_url: data.image_url || null,
        is_verified: false,
        portion: 1,
      })
      .select("food_id")
      .single();

    if (error) {
      return { success: false, error: "Gagal menyimpan makanan: " + error.message };
    }

    return { success: true, foodId: inserted.food_id };
  } catch (error) {
    console.error("[CustomFood] Save error:", error);
    return { success: false, error: "Gagal menyimpan: " + (error as Error).message };
  }
}

// 3. Orchestrator: Upload → Validasi → Return untuk konfirmasi modal

export async function processCustomFood(
  formData: FormData,
  foodName: string,
): Promise<{
  success: boolean;
  validation?: AIValidationResult;
  foodId?: string;
  imageUrl?: string;
  error?: string;
}> {
  let imageUrl: string | undefined;
  const file = formData.get("file") as File | null;

  if (file && file.size > 0) {
    const uploadResult = await uploadFoodImage(formData, foodName);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }
    imageUrl = uploadResult.url;
  }

  const validationResult = await validateFoodWithAI(foodName, imageUrl);

  if (!validationResult.success || !validationResult.data) {
    return { success: false, error: validationResult.error };
  }

  const aiData = validationResult.data;

  if (!aiData.isValid) {
    return {
      success: false,
      validation: aiData,
      imageUrl,
      error: aiData.alasan || "Makanan tidak ditemukan di knowledge base.",
    };
  }

  return { success: true, validation: aiData, imageUrl };
}
