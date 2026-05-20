// app/api/classify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchIndoBERT } from "@/lib/indobert-api";

interface ClassifyResponse {
  intent: string;
  confidence: number | null;
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const data = await fetchIndoBERT<ClassifyResponse>("/api/classify", {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
