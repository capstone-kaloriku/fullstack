"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatArea } from "./components/ChatArea";
import { InputPrompt } from "./components/InputPrompt";
import { ChatHistory } from "./components/ChatHistory";
import type { Message } from "@/types/index";
import {
  getConversations,
  getChatHistory,
  createConversation,
  deleteConversation,
  type ConversationItem,
} from "@/actions/chat-history";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function AIPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPrompt = searchParams.get("prompt");
  const hasProcessedPromptRef = useRef(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Track apakah conversation saat ini belum punya pesan (untuk generate judul)
  const isFirstMessageRef = useRef(true);

  // ── Load daftar conversations saat mount ──
  useEffect(() => {
    const load = async () => {
      setIsLoadingHistory(true);
      try {
        const convs = await getConversations();
        setConversations(convs);
        // Jika ada conversation terakhir, langsung load pesannya
        if (convs.length > 0) {
          const latest = convs[0];
          setActiveConversationId(latest.id);
          const history = await getChatHistory(latest.id);
          setMessages(
            history.map((h) => ({
              id: h.id,
              role: h.role === "assistant" ? ("ai" as const) : ("user" as const),
              content: h.content,
              timestamp: new Date(h.created_at),
            })),
          );
          isFirstMessageRef.current = false;
        }
      } catch (err) {
        console.error("Gagal load conversations:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    load();
  }, []);

  // ── Auto-send prompt dari landing page ──
  useEffect(() => {
    if (
      initialPrompt &&
      !hasProcessedPromptRef.current &&
      !isLoadingHistory
    ) {
      hasProcessedPromptRef.current = true;
      // Buat chat baru untuk prompt dari landing page
      handleNewChat();
      // Kirim prompt setelah state siap
      setTimeout(() => {
        handleSend(initialPrompt);
      }, 100);
      // Bersihkan URL search params
      router.replace("/ai", { scroll: false });
    }
  }, [initialPrompt, isLoadingHistory]);

  // ── Pilih conversation dari sidebar ──
  const handleSelectConversation = useCallback(async (id: string) => {
    if (id === activeConversationId) return;
    setActiveConversationId(id);
    setIsLoadingHistory(true);
    try {
      const history = await getChatHistory(id);
      setMessages(
        history.map((h) => ({
          id: h.id,
          role: h.role === "assistant" ? ("ai" as const) : ("user" as const),
          content: h.content,
          timestamp: new Date(h.created_at),
        })),
      );
      isFirstMessageRef.current = false;
    } catch (err) {
      console.error("Gagal load pesan:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [activeConversationId]);

  // ── Chat Baru ──
  const handleNewChat = useCallback(() => {
    setMessages([]);
    setActiveConversationId(null);
    isFirstMessageRef.current = true;
  }, []);

  // ── Hapus conversation ──
  const handleDeleteConversation = useCallback(async (id: string) => {
    await deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setMessages([]);
      setActiveConversationId(null);
      isFirstMessageRef.current = true;
    }
  }, [activeConversationId]);

  const fetchAiResponse = useCallback(
    async (userContent: string, conversationId: string, isFirst: boolean) => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userContent,
          conversationId,
          isFirstMessage: isFirst,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan pada server");
      return data.response as string;
    },
    [],
  );

  const handleSend = useCallback(
    async (content: string) => {
      setIsLoading(true);

      let convId = activeConversationId;
      const isFirst = isFirstMessageRef.current;

      if (!convId) {
        const newId = await createConversation();
        if (!newId) {
          setIsLoading(false);
          return;
        }
        convId = newId;
        setActiveConversationId(newId);
        setConversations((prev) => [
          {
            id: newId,
            title: "Percakapan Baru",
            preview: null,
            message_count: 0,
            updated_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      isFirstMessageRef.current = false;

      try {
        const aiContent = await fetchAiResponse(content, convId, isFirst);
        const aiMessage: Message = {
          id: generateId(),
          role: "ai",
          content: aiContent,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);

        if (isFirst) {
          setTimeout(async () => {
            const updated = await getConversations();
            setConversations(updated);
          }, 2000);
        } else {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === convId
                ? {
                    ...c,
                    preview: aiContent.slice(0, 120),
                    message_count: c.message_count + 2,
                    updated_at: new Date().toISOString(),
                  }
                : c,
            ),
          );
        }
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan";
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "ai",
            content: `Maaf, terjadi kesalahan: ${errMsg}. Silakan coba lagi.`,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [activeConversationId, fetchAiResponse],
  );

  const handleRegenerate = useCallback(
    async (aiMessageId: string) => {
      if (!activeConversationId) return;

      const aiIndex = messages.findIndex((m) => m.id === aiMessageId);
      if (aiIndex === -1) return;

      let lastUserIndex = -1;
      for (let i = aiIndex - 1; i >= 0; i--) {
        if (messages[i].role === "user") { lastUserIndex = i; break; }
      }
      if (lastUserIndex === -1) return;

      const lastUserContent = messages[lastUserIndex].content;

      setMessages((prev) => prev.filter((m) => m.id !== aiMessageId));
      setIsLoading(true);

      try {
        const aiContent = await fetchAiResponse(lastUserContent, activeConversationId, false);
        setMessages((prev) => [
          ...prev,
          { id: generateId(), role: "ai", content: aiContent, timestamp: new Date() },
        ]);
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan";
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(), role: "ai",
            content: `Maaf, terjadi kesalahan: ${errMsg}. Silakan coba lagi.`,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, activeConversationId, fetchAiResponse],
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* Main chat area */}
      <div className="flex flex-1 flex-col mx-auto w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl overflow-x-hidden mt-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-1.5 px-6 pb-2">
          <h1 className="text-2xl font-extrabold text-secondary-foreground">
            Tanya KalorAI
          </h1>
          <p className="text-xs text-muted-foreground text-center max-w-sm">
            Asisten nutrisi cerdasmu, siap membantu dengan pertanyaan seputar
            kalori &amp; nutrisi.
          </p>
        </div>

        {/* Chat Area */}
        <ChatArea
          messages={messages}
          isLoading={isLoading || isLoadingHistory}
          onRegenerate={handleRegenerate}
        />

        {/* Input Prompt */}
        <div className="sticky bottom-0 w-full px-4 pb-4 pt-2">
          <InputPrompt onSend={handleSend} isLoading={isLoading} />
          <p className="mt-2 text-center text-[10px] text-muted-foreground/60">
            KalorAI bisa membuat kesalahan. Periksa info penting secara mandiri.
          </p>
        </div>
      </div>

      {/* Chat History sidebar */}
      <ChatHistory
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
      />
    </div>
  );
}

export default function AIPage() {
  return (
    <Suspense fallback={null}>
      <AIPageContent />
    </Suspense>
  );
}
