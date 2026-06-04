"use server";

import Groq from "groq-sdk";
import { Redis } from "@upstash/redis";

// ============================================================
// AI Food Explanation — generate penjelasan makanan via Groq
// ============================================================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export interface FoodExplanation {
  ringkasan: string;
  komposisi: string;
  tips: string;
}

/**
 * Generate penjelasan makanan menggunakan Groq AI.
 * Hasilnya di‑cache di Redis selama 7 hari.
 */
export async function getFoodExplanation(
  foodName: string,
  calories: number,
  protein?: number,
  carbs?: number,
  fat?: number,
): Promise<FoodExplanation> {
  const normalizedName = foodName.toLowerCase().trim().replace(/\s+/g, " ");
  const cacheKey = `kaloriku:food_explanation_v1:${normalizedName}`;

  try {
    // --- cek cache dulu ---
    const cached = await redis.get<FoodExplanation>(cacheKey);
    if (cached) {
      console.log(`[Explanation] Cache hit: ${foodName}`);
      return cached;
    }

    console.log(`[Explanation] Cache miss: ${foodName}, memanggil Groq...`);

    // --- build nutrisi context ---
    const nutrisiParts = [`${calories} kcal per porsi`];
    if (protein) nutrisiParts.push(`protein ${protein}g`);
    if (carbs) nutrisiParts.push(`karbohidrat ${carbs}g`);
    if (fat) nutrisiParts.push(`lemak ${fat}g`);
    const nutrisiText = nutrisiParts.join(", ");

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Kamu adalah ahli gizi Indonesia yang ramah dan informatif.
Tugasmu: berikan penjelasan singkat tentang makanan yang diberikan user.

ATURAN:
1. Tulis dalam bahasa Indonesia yang mudah dipahami, tidak terlalu formal.
2. Setiap bagian cukup 2-3 kalimat saja, padat dan informatif.
3. Jangan mengulangi nama makanan terlalu sering.
4. Sesuaikan tips dengan jenis makanannya.

Keluarkan output HANYA dalam format JSON:
{
  "ringkasan": "Penjelasan singkat tentang makanan ini, asal-usul, dan cara penyajian umum.",
  "komposisi": "Penjelasan tentang komposisi nutrisi utama dan manfaatnya bagi tubuh.",
  "tips": "Tips praktis terkait cara mengonsumsi makanan ini agar lebih sehat."
}`,
        },
        {
          role: "user",
          content: `Jelaskan makanan: "${foodName}". Data nutrisi: ${nutrisiText}.`,
        },
      ],
      model: "llama-3.1-8b-instant",
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Response Groq kosong");
    }

    const parsed: FoodExplanation = JSON.parse(content);

    // cache 7 hari
    await redis.set(cacheKey, parsed, { ex: 604800 });

    return parsed;
  } catch (error) {
    console.error("[Explanation] Gagal generate:", error);

    // fallback statis jika AI gagal
    return {
      ringkasan: `${foodName} adalah makanan dengan kandungan sekitar ${calories} kcal per porsi. Makanan ini umum dijumpai dalam kuliner Indonesia dan memiliki rasa yang khas.`,
      komposisi: `Makanan ini mengandung karbohidrat sebagai sumber energi utama, protein untuk memperbaiki jaringan tubuh, dan lemak yang membantu penyerapan vitamin. Keseimbangan nutrisi ini penting untuk menjaga kesehatan.`,
      tips: `Konsumsi dalam porsi yang wajar dan seimbangkan dengan sayur serta buah. Hindari makan berlebihan dan pastikan asupan air putih yang cukup setiap hari.`,
    };
  }
}
