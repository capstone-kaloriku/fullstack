"use server";

// import Groq from "groq-sdk"; // dinonaktifkan — pakai Railway API
import { fetchIndoBERT } from "@/lib/indobert-api";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export interface FoodExplanation {
  ringkasan: string;
  komposisi: string;
  tips: string;
}

interface RailwayChatResponse {
  intent: string;
  response: string;
  food_extracted?: unknown;
}

/**
 * Generate penjelasan makanan via Railway /api/chat.
 * Hasilnya di-cache di Redis selama 7 hari.
 */
export async function getFoodExplanation(
  foodName: string,
  calories: number,
  protein?: number,
  carbs?: number,
  fat?: number,
): Promise<FoodExplanation> {
  const normalizedName = foodName.toLowerCase().trim().replace(/\s+/g, " ");
  const cacheKey = `kaloriku:food_explanation_v2:${normalizedName}`;

  try {
    const cached = await redis.get<FoodExplanation>(cacheKey);
    if (cached) {
      console.log(`[Explanation] Cache hit: ${foodName}`);
      return cached;
    }

    console.log(`[Explanation] Cache miss: ${foodName}, memanggil Railway...`);

    const nutrisiParts = [`${calories} kcal per porsi`];
    if (protein) nutrisiParts.push(`protein ${protein}g`);
    if (carbs) nutrisiParts.push(`karbohidrat ${carbs}g`);
    if (fat) nutrisiParts.push(`lemak ${fat}g`);
    const nutrisiText = nutrisiParts.join(", ");

    const prompt =
      `Jelaskan makanan "${foodName}" (${nutrisiText}) dalam 3 bagian singkat. ` +
      `Jawab dengan format JSON: {"ringkasan": "...", "komposisi": "...", "tips": "..."}. ` +
      `Setiap bagian cukup 2-3 kalimat. Bahasa Indonesia yang mudah dipahami.`;

    const data = await fetchIndoBERT<RailwayChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: prompt }),
    });

    // Coba parse JSON dari response Railway
    const responseText = data.response ?? "";
    let parsed: FoodExplanation;

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      parsed = null as unknown as FoodExplanation;
    }

    // Fallback: Railway tidak return JSON → pakai response text sebagai ringkasan
    if (!parsed?.ringkasan) {
      parsed = {
        ringkasan: responseText || `${foodName} adalah makanan dengan kandungan sekitar ${calories} kcal per porsi.`,
        komposisi: `Mengandung ${nutrisiText}.`,
        tips: "Konsumsi dalam porsi yang wajar dan seimbangkan dengan sayur serta buah.",
      };
    }

    await redis.set(cacheKey, parsed, { ex: 604800 });
    return parsed;
  } catch (error) {
    console.error("[Explanation] Gagal generate:", error);

    return {
      ringkasan: `${foodName} adalah makanan dengan kandungan sekitar ${calories} kcal per porsi. Makanan ini umum dijumpai dalam kuliner Indonesia dan memiliki rasa yang khas.`,
      komposisi: `Makanan ini mengandung karbohidrat sebagai sumber energi utama, protein untuk memperbaiki jaringan tubuh, dan lemak yang membantu penyerapan vitamin.`,
      tips: `Konsumsi dalam porsi yang wajar dan seimbangkan dengan sayur serta buah. Hindari makan berlebihan dan pastikan asupan air putih yang cukup setiap hari.`,
    };
  }
}
