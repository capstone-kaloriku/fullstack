// app/api/exercises/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchIndoBERT } from "@/lib/indobert-api";

interface ExerciseResponse {
  results: Record<string, any>[];
  total: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const limit = searchParams.get("limit") || "20";

    let endpoint = `/api/exercises?limit=${limit}`;
    if (q) endpoint += `&q=${encodeURIComponent(q)}`;

    const data = await fetchIndoBERT<ExerciseResponse>(endpoint);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
