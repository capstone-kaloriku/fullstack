"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { BsStars } from "react-icons/bs";
import { LuCopy, LuRefreshCw, LuThumbsUp, LuThumbsDown, LuCheck } from "react-icons/lu";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/types/index";

interface ChatMessageProps {
  message: Message;
  onRegenerate?: (messageId: string) => void;
  canRegenerate?: boolean;
}

type Feedback = "like" | "dislike" | null;

export function ChatMessage({
  message,
  onRegenerate,
  canRegenerate = false,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success("Pesan disalin");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin pesan");
    }
  };

  const handleRegenerate = () => {
    onRegenerate?.(message.id);
  };

  const handleFeedback = (type: Exclude<Feedback, null>) => {
    setFeedback((prev) => (prev === type ? null : type));
    if (feedback !== type) {
      toast.success(
        type === "like" ? "Terima kasih atas feedbacknya!" : "Feedback diterima, kami akan terus belajar"
      );
    }
  };

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

      <div className={cn("flex flex-col gap-1.5", isUser ? "items-end" : "items-start", "max-w-[80%]")}>
        {/* Message Bubble */}
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs",
            isUser
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md bg-card text-card-foreground ring-1 ring-foreground/5"
          )}
        >
          {isUser ? (
            <div className="flex flex-col gap-2">
              {/* Tampilkan gambar yang dilampirkan (kalau ada) di atas teks */}
              {message.image && (
                <Image
                  src={message.image}
                  alt="Gambar dari user"
                  width={240}
                  height={240}
                  className="max-h-60 w-auto rounded-lg object-cover"
                  unoptimized
                />
              )}
              {message.content && (
                <p className="whitespace-pre-wrap wrap-break-word">
                  {message.content}
                </p>
              )}
            </div>
          ) : (
            <div className="wrap-break-word text-sm text-card-foreground leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h3: ({ children }) => (
                    <h3 className="flex items-center gap-1.5 text-base font-semibold text-foreground mt-5 mb-2 first:mt-0">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="my-2 leading-relaxed first:mt-0 last:mb-0">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-2 ml-4 space-y-1 list-disc marker:text-muted-foreground/70">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-2 ml-4 space-y-1 list-decimal marker:text-muted-foreground/70">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="pl-1 leading-relaxed">{children}</li>
                  ),
                  hr: () => <hr className="my-4 border-t border-border/40" />,
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">
                      {children}
                    </strong>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-2 pl-3 border-l-2 border-border/60 text-muted-foreground italic">
                      {children}
                    </blockquote>
                  ),
                  // Table — render rapi untuk data terstruktur (menu, nutrisi, dll)
                  table: ({ children }) => (
                    <div className="my-3 -mx-1 overflow-x-auto rounded-lg ring-1 ring-border/60">
                      <table className="w-full border-collapse text-xs">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-muted/60">{children}</thead>
                  ),
                  tbody: ({ children }) => <tbody>{children}</tbody>,
                  tr: ({ children }) => (
                    <tr className="border-b border-border/30 last:border-b-0 hover:bg-muted/30 transition-colors">
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th className="px-3 py-2 text-left font-semibold text-foreground whitespace-nowrap">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-3 py-2 align-top text-card-foreground/90">
                      {children}
                    </td>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
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

        {/* Action bar — hanya untuk pesan AI */}
        {!isUser && (
          <div className="flex items-center gap-0.5 px-1">
            <ActionButton
              icon={copied ? <LuCheck className="size-3.5" /> : <LuCopy className="size-3.5" />}
              onClick={handleCopy}
              label={copied ? "Tersalin" : "Salin"}
              active={copied}
            />
            {canRegenerate && (
              <ActionButton
                icon={<LuRefreshCw className="size-3.5" />}
                onClick={handleRegenerate}
                label="Regenerasi"
              />
            )}
            <ActionButton
              icon={<LuThumbsUp className="size-3.5" />}
              onClick={() => handleFeedback("like")}
              label="Suka"
              active={feedback === "like"}
            />
            <ActionButton
              icon={<LuThumbsDown className="size-3.5" />}
              onClick={() => handleFeedback("dislike")}
              label="Tidak suka"
              active={feedback === "dislike"}
            />
          </div>
        )}
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

interface ActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}

function ActionButton({ icon, onClick, label, active }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex size-7 items-center justify-center rounded-md transition-colors",
        "text-muted-foreground hover:bg-muted hover:text-foreground",
        active && "text-primary bg-primary/10 hover:bg-primary/15 hover:text-primary"
      )}
    >
      {icon}
    </button>
  );
}
