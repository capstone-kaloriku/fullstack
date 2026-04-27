"use client";

import { useState, useCallback } from "react";
import { ChatArea } from "./components/ChatArea";
import { InputPrompt } from "./components/InputPrompt";
import type { Message } from "./types";

const AI_RESPONSES = [
  "Nasi goreng biasa mengandung sekitar 500-700 kalori per porsi, tergantung bahan dan minyak yang digunakan. Jika ditambahkan telur dan ayam, bisa mencapai 800+ kalori.",
  "Untuk diet sehat, usahakan konsumsi makanan dengan komposisi: 45-65% karbohidrat, 20-35% lemak, dan 10-35% protein. Jangan lupa perbanyak serat dari sayuran dan buah-buahan! 🥗",
  "Kebutuhan kalori harian rata-rata orang dewasa adalah 2.000-2.500 kkal. Namun ini bervariasi tergantung usia, jenis kelamin, tinggi badan, berat badan, dan tingkat aktivitas fisik.",
  "Air putih sangat penting! Disarankan minum 8 gelas (sekitar 2 liter) per hari. Minum air sebelum makan juga bisa membantu mengontrol porsi makan. 💧",
  "Protein hewani (daging, ikan, telur) dan nabati (tahu, tempe, kacang-kacangan) sama pentingnya. Variasikan sumber protein untuk mendapatkan asam amino yang lengkap.",
  "Camilan sehat yang rendah kalori: apel (95 kkal), yogurt rendah lemak (100 kkal), almond 10 butir (70 kkal), atau wortel mentah (25 kkal per batang). 🍎",
];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = useCallback((content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response with a realistic delay
    const delay = 1000 + Math.random() * 1500;
    setTimeout(() => {
      const aiMessage: Message = {
        id: generateId(),
        role: "ai",
        content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, delay);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full mx-auto max-w-2xl overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 px-6 pt-4 pb-2">
        <h1 className="text-2xl font-extrabold text-secondary-foreground">
          Tanya KalorAI
        </h1>
        <p className="text-xs text-muted-foreground text-center max-w-sm">
          Asisten nutrisi cerdasmu, siap membantu dengan pertanyaan seputar
          kalori & nutrisi.
        </p>
      </div>

      {/* Chat Area */}
      <ChatArea messages={messages} isLoading={isLoading} />

      {/* Input Prompt — pinned to bottom */}
      <div className="sticky bottom-0 w-full px-4 pb-4 pt-2">
        <InputPrompt onSend={handleSend} isLoading={isLoading} />
        <p className="mt-2 text-center text-[10px] text-muted-foreground/60">
          KalorAI bisa membuat kesalahan. Periksa info penting secara mandiri.
        </p>
      </div>
    </div>
  );
}
