"use client";

import { useState, useCallback } from "react";
import { ChatArea } from "./components/ChatArea";
import { InputPrompt } from "./components/InputPrompt";
import type { Message } from "@/types/index";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Terjadi kesalahan pada server");
      }

      const aiMessage: Message = {
        id: generateId(),
        role: "ai",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: generateId(),
        role: "ai",
        content: `Maaf, terjadi kesalahan: ${error.message}. Silakan coba lagi.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full mx-auto max-w-2xl lg:max-w-3xl xl:max-w-4xl overflow-x-hidden mt-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 px-6 pb-2">
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
