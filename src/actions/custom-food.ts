"use server";

import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";
import { uploadFoodImage } from "./upload-image";

// ============================================================
// Custom Food — AI Validation & Save
// ============================================================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// -----------------------------------------------------------
// Types
// -----------------------------------------------------------

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

// -----------------------------------------------------------
// 1. Validasi makanan dengan AI (text‑based)
// -----------------------------------------------------------

/**
 * Kirim nama makanan (+ opsional URL gambar) ke Groq AI.
 * AI akan memvalidasi apakah input adalah makanan sungguhan,
 * lalu mengembalikan estimasi nutrisi.
 */
export async function validateFoodWithAI(
  foodName: string,
  imageUrl?: string,
): Promise<{ success: boolean; data?: AIValidationResult; error?: string }> {
  try {
    if (!foodName || foodName.trim().length < 2) {
      return { success: false, error: "Nama makanan terlalu pendek." };
    }

    const imageContext = imageUrl
      ? `\nGambar makanan telah diupload ke: ${imageUrl}`
      : "";

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
          content: `Validasi makanan berikut: "${foodName.trim()}"${imageContext}`,
        },
      ],
      model: "llama-3.1-8b-instant",
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content;

    if (!content) {
      return { success: false, error: "Response AI kosong." };
    }

    const parsed: AIValidationResult = JSON.parse(content);

    return { success: true, data: parsed };
  } catch (error) {
    console.error("Error validasi AI:", error);
    return {
      success: false,
      error: "Gagal memvalidasi dengan AI: " + (error as Error).message,
    };
  }
}

// -----------------------------------------------------------
// 2. Simpan custom food ke database
// -----------------------------------------------------------

/**
 * Simpan custom food ke tabel `food_items`.
 * Field `is_verified` di‑set `false` karena ini input user.
 */
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

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return { success: false, error: "User tidak ditemukan." };
    }

    // Generate slug dari nama
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
      return {
        success: false,
        error: "Gagal menyimpan makanan: " + error.message,
      };
    }

    return { success: true, foodId: inserted.food_id };
  } catch (error) {
    console.error("Error saving custom food:", error);
    return {
      success: false,
      error: "Gagal menyimpan: " + (error as Error).message,
    };
  }
}

// -----------------------------------------------------------
// 3. Flow lengkap: Upload → Validasi → Simpan
// -----------------------------------------------------------

/**
 * Orchestrator: upload gambar, validasi AI, lalu simpan ke DB.
 * Ini yang dipanggil dari frontend Custom Food form.
 */
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
  // --- 1. Upload gambar (opsional) ---
  let imageUrl: string | undefined;
  const file = formData.get("file") as File | null;

  if (file && file.size > 0) {
    const uploadResult = await uploadFoodImage(formData, foodName);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }
    imageUrl = uploadResult.url;
  }

  // --- 2. Validasi dengan AI ---
  const validationResult = await validateFoodWithAI(foodName, imageUrl);

  if (!validationResult.success || !validationResult.data) {
    return { success: false, error: validationResult.error };
  }

  const aiData = validationResult.data;

  // Jika AI bilang bukan makanan valid → kembalikan tanpa simpan
  if (!aiData.isValid) {
    return {
      success: false,
      validation: aiData,
      imageUrl,
      error: aiData.alasan || "AI mendeteksi input bukan makanan yang valid.",
    };
  }

  // --- 3. Return hasil validasi (belum simpan) ---
  // Frontend akan menampilkan modal konfirmasi dulu,
  // lalu memanggil saveCustomFood() jika user setuju.
  return {
    success: true,
    validation: aiData,
    imageUrl,
  };
}
