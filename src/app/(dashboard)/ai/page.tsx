"use client";

import { useState, useCallback } from "react";
import { ChatArea } from "./components/ChatArea";
import { InputPrompt } from "./components/InputPrompt";
import type { Message } from "@/types/index";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Konversi Message[] dari state ke format history yang diterima API.
// Kirim seluruh percakapan apa adanya (tanpa batas jumlah pesan).
function buildHistory(messages: Message[]) {
  return messages
    .filter((m) => m.content && m.content.trim().length > 0)
    .map((m) => ({
      role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
      content: m.content,
    }));
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper: panggil API dengan optional image + history
  const fetchAiResponse = useCallback(
    async (
      userContent: string,
      image: string | undefined,
      history: ReturnType<typeof buildHistory>
    ) => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userContent, image, history }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Terjadi kesalahan pada server");
      }
      return data.response as string;
    },
    []
  );

  const handleSend = useCallback(
    async (content: string, image?: string) => {
      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
        image,
      };

      const historySnapshot = buildHistory(messages);
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const aiContent = await fetchAiResponse(content, image, historySnapshot);
        const aiMessage: Message = {
          id: generateId(),
          role: "ai",
          content: aiContent,
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
    },
    [messages, fetchAiResponse]
  );

  const handleRegenerate = useCallback(
    async (aiMessageId: string) => {
      const aiIndex = messages.findIndex((m) => m.id === aiMessageId);
      if (aiIndex === -1) return;

      let lastUserIndex = -1;
      for (let i = aiIndex - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
          lastUserIndex = i;
          break;
        }
      }
      if (lastUserIndex === -1) return;

      const lastUserContent = messages[lastUserIndex].content;
      const lastUserImage = messages[lastUserIndex].image;
      const historySnapshot = buildHistory(messages.slice(0, lastUserIndex));

      setMessages((prev) => prev.filter((m) => m.id !== aiMessageId));
      setIsLoading(true);

      try {
        const aiContent = await fetchAiResponse(
          lastUserContent,
          lastUserImage,
          historySnapshot
        );
        const aiMessage: Message = {
          id: generateId(),
          role: "ai",
          content: aiContent,
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
    },
    [messages, fetchAiResponse]
  );

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
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        onRegenerate={handleRegenerate}
      />

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
