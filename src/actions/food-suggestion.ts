"use server";

// import Groq from "groq-sdk"; // dinonaktifkan — pakai Railway API
import { fetchIndoBERT } from "@/lib/indobert-api";
import { createClient } from "@/lib/supabase/server";

export interface LaukSuggestion {
  nama: string;
  kalori: number;
}

export type MealCategory = "makanan_berat" | "makanan_ringan" | "camilan" | "minuman";

const CATEGORY_MAP: Record<string, MealCategory> = {
  makanan_berat: "makanan_berat",
  makanan_ringan: "makanan_ringan",
  camilan: "camilan",
  minuman: "minuman",
};

interface RailwayChatResponse {
  intent: string;
  response: string;
  food_extracted?: unknown;
}

// ── Util: parse JSON dari response teks Railway ──
function parseJsonFromText<T>(text: string): T | null {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? (JSON.parse(match[0]) as T) : null;
  } catch {
    return null;
  }
}

// ============================================================
// 0. Detect meal category (mapping DB → Railway fallback)
// ============================================================

export async function detectMealCategory(
  foodName: string,
  kategori?: string,
): Promise<MealCategory> {
  if (kategori) {
    const mapped = CATEGORY_MAP[kategori.toLowerCase().trim()];
    if (mapped) {
      console.log(`[MealType] Mapped "${kategori}" → "${mapped}"`);
      return mapped;
    }
  }

  try {
    console.log(`[MealType] Railway detect untuk "${foodName}"...`);

    const prompt =
      `Klasifikasikan makanan "${foodName}" ke salah satu kategori: ` +
      `"makanan_berat", "makanan_ringan", "camilan", atau "minuman". ` +
      `Output HANYA JSON: { "category": "makanan_berat" }`;

    const data = await fetchIndoBERT<RailwayChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: prompt }),
    });

    const parsed = parseJsonFromText<{ category: string }>(data.response ?? "");
    const detected = parsed?.category as MealCategory;

    if (detected && CATEGORY_MAP[detected]) return detected;
    return "makanan_berat";
  } catch (error) {
    console.error("[MealType] Detect gagal:", error);
    return "makanan_berat";
  }
}

// ============================================================
// 1. Generate saran lauk (TIDAK save ke DB)
// ============================================================

export async function getDynamicLaukSuggestions(
  foodId: string,
  foodName: string,
): Promise<LaukSuggestion[]> {
  try {
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

    console.log(`[Lauk] Generate saran untuk "${foodName}"...`);
    return await generateLaukFromRailway(foodName);
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

export async function addManualLauk(laukName: string): Promise<AddLaukResult> {
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
// Internal — Railway AI Functions
// ============================================================

async function generateLaukFromRailway(foodName: string): Promise<LaukSuggestion[]> {
  const prompt =
    `Analisa makanan "${foodName}" dan berikan lauk/pelengkap yang RELEVAN. ` +
    `Aturan: jika makanan adalah jajanan/snack/minuman kembalikan array kosong. ` +
    `Maksimal 4 lauk, nama singkat maks 3 kata, kalori per porsi standar (bilangan bulat). ` +
    `Output HANYA JSON: { "suggestions": [{ "nama": "Sambal", "kalori": 30 }] }`;

  const data = await fetchIndoBERT<RailwayChatResponse>("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message: prompt }),
  });

  const parsed = parseJsonFromText<{ suggestions?: LaukSuggestion[]; components?: LaukSuggestion[] }>(
    data.response ?? "",
  );

  return ((parsed?.suggestions || parsed?.components) ?? []).slice(0, 4);
}

interface SingleLaukValidation {
  isValid: boolean;
  nama: string;
  kalori: number;
  alasan?: string;
}

async function validateSingleLauk(laukName: string): Promise<SingleLaukValidation> {
  const prompt =
    `Validasi apakah "${laukName}" adalah lauk/makanan yang valid. ` +
    `Jika bukan makanan (misal: "meja", "hp"), set isValid false. ` +
    `Jika valid, estimasi kalori per porsi standar dan perbaiki penulisan nama. ` +
    `Output HANYA JSON: { "isValid": true, "nama": "Tempe Goreng", "kalori": 150, "alasan": null }`;

  const data = await fetchIndoBERT<RailwayChatResponse>("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message: prompt }),
  });

  const parsed = parseJsonFromText<SingleLaukValidation>(data.response ?? "");

  if (!parsed) throw new Error("Response Railway tidak dapat diparsing");
  return parsed;
}
