"use server";

import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";

// ============================================================
// Lauk Suggestion — AI generate + save HANYA saat user Simpan
// ============================================================
//
// Flow:
//  1. Page load → AI generate saran lauk → tampilkan (TIDAK save ke DB)
//  2. User pilih lauk (klik + atau input manual)
//  3. User klik Simpan → consumption_log + food_components masuk DB
// ============================================================

export interface LaukSuggestion {
  nama: string;
  kalori: number;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// ============================================================
// 1. Generate saran lauk (TIDAK save ke DB)
// ============================================================

/**
 * Generate saran lauk untuk makanan.
 * Cek DB dulu (kalau pernah disimpan user sebelumnya).
 * Kalau kosong → panggil AI. Hasilnya TIDAK di-save ke DB.
 *
 * @param foodId   – UUID makanan
 * @param foodName – Nama makanan untuk prompt AI
 */
export async function getDynamicLaukSuggestions(
  foodId: string,
  foodName: string,
): Promise<LaukSuggestion[]> {
  try {
    // ── Cek DB: apakah user pernah simpan lauk untuk food ini ──
    const supabase = await createClient();
    const { data: existing } = await supabase
      .from("food_components")
      .select("name, calories")
      .eq("food_id", foodId)
      .order("created_at");

    if (existing && existing.length > 0) {
      console.log(`[Lauk] DB hit: ${foodName} (${existing.length} komponen)`);
      return existing.map((c) => ({
        nama: c.name,
        kalori: c.calories ?? 0,
      }));
    }

    // ── DB kosong → generate dari AI ────────────────────────
    console.log(`[Lauk] Generate saran untuk "${foodName}"...`);
    return await generateLaukFromAI(foodName);
  } catch (error) {
    console.error("[Lauk] Error:", error);
    return [];
  }
}

// ============================================================
// 2. Validasi + tambah lauk manual dari input user
// ============================================================

interface AddLaukResult {
  success: boolean;
  data?: LaukSuggestion;
  error?: string;
}

/**
 * Validasi lauk manual via AI. TIDAK save ke DB.
 * Hanya return data kalori + validasi.
 * DB save terjadi saat user klik Simpan.
 */
export async function addManualLauk(
  laukName: string,
): Promise<AddLaukResult> {
  const trimmed = laukName.trim();

  if (!trimmed || trimmed.length < 2) {
    return { success: false, error: "Nama lauk terlalu pendek." };
  }

  try {
    const aiResult = await validateSingleLauk(trimmed);

    if (!aiResult.isValid) {
      return {
        success: false,
        error: aiResult.alasan || `"${trimmed}" bukan lauk/makanan yang valid.`,
      };
    }

    return {
      success: true,
      data: { nama: aiResult.nama, kalori: aiResult.kalori },
    };
  } catch (error) {
    console.error("[Lauk Manual] Error:", error);
    return {
      success: false,
      error: "Gagal memvalidasi lauk: " + (error as Error).message,
    };
  }
}

// ============================================================
// 3. Save lauk ke DB (dipanggil saat user klik Simpan)
// ============================================================

/**
 * Simpan lauk yang dipilih user ke food_components.
 * Dipanggil HANYA saat form di-submit (klik Simpan).
 */
export async function saveLaukComponents(
  foodId: string,
  laukList: LaukSuggestion[],
): Promise<{ success: boolean; error?: string }> {
  if (laukList.length === 0) return { success: true };

  try {
    const supabase = await createClient();

    const rows = laukList.map((l) => ({
      food_id: foodId,
      name: l.nama,
      calories: l.kalori,
      protein_gram: 0,
      carbs_gram: 0,
      fat_gram: 0,
      component_type: "lauk" as const,
    }));

    const { error } = await supabase.from("food_components").insert(rows);

    if (error) {
      console.error("[Lauk Save] DB error:", error.message);
      return { success: false, error: error.message };
    }

    console.log(`[Lauk Save] Saved ${laukList.length} komponen untuk food ${foodId}`);
    return { success: true };
  } catch (error) {
    console.error("[Lauk Save] Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================
// Internal — Groq AI Functions
// ============================================================

/** Generate saran lauk dari AI (TIDAK save ke DB) */
async function generateLaukFromAI(foodName: string): Promise<LaukSuggestion[]> {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Kamu adalah ahli gizi Indonesia yang sangat teliti.
Tugasmu: analisa makanan dan identifikasi HANYA lauk/pelengkap yang BENAR-BENAR relevan.

ATURAN KETAT:
1. FOKUS pada lauk yang secara TRADISIONAL dan UMUM disajikan bersama makanan ini.
2. Misal "Nasi Ayam Bakar" → "Lalapan" (pelengkap), "Sambal" (pelengkap). BUKAN "Kacang Merah" yang tidak ada hubungannya.
3. Misal "Lemper Ayam" → ini jajanan, TIDAK perlu lauk. Kembalikan array kosong [].
4. Jika makanan adalah jajanan/snack (lemper, risol, onde-onde, dll) → kembalikan array kosong.
5. Jika makanan adalah minuman → kembalikan array kosong.
6. Hanya makanan utama (nasi, mie, bubur, dll) yang perlu lauk.
7. Nama lauk singkat, maks 3 kata. Kalori per 1 porsi standar (bilangan bulat).
8. Maksimal 4 lauk. Lebih sedikit lebih baik jika memang relevan sedikit.

Output HANYA JSON valid:
{ "suggestions": [{ "nama": "Sambal", "kalori": 30 }, { "nama": "Lalapan", "kalori": 25 }] }
Jika tidak ada lauk yang relevan: { "suggestions": [] }`,
      },
      {
        role: "user",
        content: `Analisa makanan: "${foodName}". Apa saja lauk/pelengkap yang RELEVAN?`,
      },
    ],
    model: "llama-3.1-8b-instant",
    max_tokens: 300,
    response_format: { type: "json_object" },
  });

  const content = chatCompletion.choices[0]?.message?.content;
  if (!content) return [];

  const parsed = JSON.parse(content);
  const suggestions: LaukSuggestion[] = (parsed.suggestions || parsed.components || []).slice(0, 4);

  return suggestions;
}

// ============================================================
// Internal — Validasi satu lauk via AI
// ============================================================

interface SingleLaukValidation {
  isValid: boolean;
  nama: string;
  kalori: number;
  alasan?: string;
}

/** Validasi apakah input user adalah lauk/makanan valid */
async function validateSingleLauk(laukName: string): Promise<SingleLaukValidation> {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Kamu adalah ahli gizi Indonesia.
Tugasmu: validasi apakah input user adalah lauk/makanan yang valid.

ATURAN:
1. Jika input BUKAN lauk/makanan (misal: "meja", "hp", kata random), set "isValid" = false.
2. Jika valid, estimasi kalori per 1 porsi standar (bilangan bulat).
3. Perbaiki penulisan nama (misal: "tempe greng" → "Tempe Goreng").

Output HANYA JSON valid:
{ "isValid": true, "nama": "Tempe Goreng", "kalori": 150, "alasan": null }`,
      },
      {
        role: "user",
        content: `Validasi lauk: "${laukName}"`,
      },
    ],
    model: "llama-3.1-8b-instant",
    max_tokens: 150,
    response_format: { type: "json_object" },
  });

  const content = chatCompletion.choices[0]?.message?.content;
  if (!content) throw new Error("Response Groq kosong");

  return JSON.parse(content) as SingleLaukValidation;
}
