// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchIndoBERT } from "@/lib/indobert-api";

interface ChatResponse {
  intent: string;
  food_extracted: Record<string, any> | null;
  response: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const data = await fetchIndoBERT<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Chat API Error]", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
