// app/api/food/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchIndoBERT } from "@/lib/indobert-api";

interface FoodSearchResponse {
  results: Record<string, any>[];
  total: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const limit = searchParams.get("limit") || "10";

    if (!q) {
      return NextResponse.json(
        { error: "Parameter 'q' wajib diisi" },
        { status: 400 }
      );
    }

    const data = await fetchIndoBERT<FoodSearchResponse>(
      `/api/food/search?q=${encodeURIComponent(q)}&limit=${limit}`
    );

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
