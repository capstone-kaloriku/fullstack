// app/api/food/[name]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchIndoBERT } from "@/lib/indobert-api";

interface FoodDetailResponse {
  found: boolean;
  data: Record<string, any> | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const data = await fetchIndoBERT<FoodDetailResponse>(
      `/api/food/${encodeURIComponent(params.name)}`
    );

    if (!data.found) {
      return NextResponse.json(
        { error: "Makanan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
