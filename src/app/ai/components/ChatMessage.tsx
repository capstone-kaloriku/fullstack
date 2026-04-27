"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { BsStars } from "react-icons/bs";
import type { Message } from "../types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <BsStars className="size-4" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={cn(
          "relative max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card text-card-foreground ring-1 ring-foreground/5"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <span
          className={cn(
            "mt-1.5 block text-[10px] tabular-nums",
            isUser
              ? "text-primary-foreground/60 text-right"
              : "text-muted-foreground"
          )}
        >
          {message.timestamp.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-sm">
          <span className="text-xs font-bold">U</span>
        </div>
      )}
    </motion.div>
  );
}
