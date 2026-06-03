"use server";

import Groq from "groq-sdk";
import { Redis } from "@upstash/redis";

interface LaukSuggestion {
  nama: string;
  kalori: number;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function getDynamicLaukSuggestions(
  currentFood: string,
): Promise<LaukSuggestion[]> {
  const normalizedFood = currentFood.toLowerCase().trim().replace(/\s+/g, " ");
  const cacheKey = `kaloriku:lauk_suggestions_v2:${normalizedFood}`;

  try {
    const cachedSuggestions = await redis.get<LaukSuggestion[]>(cacheKey);

    if (cachedSuggestions) {
      console.log(`Cache hit untuk ${currentFood}`);
      return cachedSuggestions;
    }
    console.log(`Cache miss untuk ${currentFood}, memanggil Groq...`);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Kamu adalah asisten analis nutrisi makanan Indonesia.
    Tugasmu adalah MENGANALISA nama makanan yang diberikan, lalu mengidentifikasi komponen lauk/pelengkap apa saja yang terkandung atau biasa disajikan bersama makanan tersebut.

    ATURAN SANGAT PENTING:
    1. ANALISA makanan yang ada pada nama input. Misal: "Nasi Ayam Bakar Tempe" → identifikasi "Ayam Bakar" dan "Tempe Goreng" sebagai lauk yang ada.
    2. Jika makanan utama jelas (misal "Nasi Goreng"), identifikasi komponen pelengkap standar yang BIASA ada di piring tersebut (misal: "Telur Ceplok", "Kerupuk").
    3. JANGAN menyarankan makanan baru yang tidak berhubungan. Fokus pada apa yang sudah ADA di dalam makanan tersebut.
    4. Nama komponen harus singkat, maksimal 3 kata.
    5. Sertakan perkiraan kalori per 1 porsi standar untuk setiap lauk (dalam kcal, bilangan bulat).
    6. Maksimal 4 komponen lauk saja.

    Keluarkan output HANYA dalam format JSON dengan struktur yang valid:
    { "suggestions": [{ "nama": "Ayam Goreng", "kalori": 250 }, { "nama": "Tempe Goreng", "kalori": 150 }] }`,
        },
        {
          role: "user",
          content: `Analisa makanan berikut: "${currentFood}". Identifikasi lauk/komponen apa saja yang ada atau biasa disajikan bersamaan, beserta perkiraan kalorinya.`,
        },
      ],
      model: "llama-3.1-8b-instant",
      max_tokens: 250,
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("Response dari Groq kosong");
    }

    const parsedData = JSON.parse(responseContent);
    const suggestions: LaukSuggestion[] = (parsedData.suggestions || []).slice(0, 4);

    // Cache selama 24 jam
    await redis.set(cacheKey, suggestions, { ex: 86400 });

    return suggestions;
  } catch (error) {
    console.error("Gagal mendapatkan rekomendasi Groq:", error);

    return [
      { nama: "Ayam Goreng", kalori: 250 },
      { nama: "Tempe Goreng", kalori: 150 },
      { nama: "Tahu Goreng", kalori: 115 },
      { nama: "Telur Dadar", kalori: 185 },
    ];
  }
}
