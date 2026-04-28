"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BsStars } from "react-icons/bs";
import { ChatMessage } from "./ChatMessage";
import type { Message } from "@/types/index";

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatArea({ messages, isLoading }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <ScrollArea className="flex-1 w-full">
      <div className="flex flex-col gap-4 px-1 py-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Typing indicator */}
        {isLoading && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <BsStars className="size-7" />
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          Mulai percakapan
        </h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          Tanyakan apa saja tentang kalori, nutrisi, atau pola makan sehatmu.
        </p>
      </div>

      {/* Suggestion chips */}
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {[
          "Berapa kalori nasi goreng?",
          "Menu diet sehat",
          "Kebutuhan protein harian",
        ].map((suggestion) => (
          <span
            key={suggestion}
            className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground shadow-xs transition-colors hover:bg-muted"
          >
            {suggestion}
          </span>
        ))}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex w-full gap-3 justify-start">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
        <BsStars className="size-4" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-card px-4 py-3 shadow-xs ring-1 ring-foreground/5">
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
      </div>
    </div>
  );
}
