"use client";

import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { LuSend, LuLoader } from "react-icons/lu";

// ── Fitur gambar dinonaktifkan ──
// import Image from "next/image";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { LuImage, LuX, LuChevronDown, LuCheck, LuSparkles } from "react-icons/lu";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// ── Model switcher dinonaktifkan ──
// type ModelId = "nutriai" | "opus-4-6" | "deepseek-v4";
// interface ModelOption { id: ModelId; name: string; description: string; available: boolean; }
// const MODEL_OPTIONS: ModelOption[] = [ ... ];
// const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
// const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface InputPromptProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function InputPrompt({ onSend, isLoading }: InputPromptProps) {
  const [value, setValue] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const canSubmit = !isLoading && value.trim().length > 0;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="w-full">
      <Field>
        <div className="rounded-2xl px-3 py-2 shadow-md bg-card ring-1 ring-foreground/5">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanya tentang kalori, nutrisi, atau pola makan sehat..."
            rows={1}
            aria-label="Chat message input"
            className="w-full resize-none bg-transparent px-1 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none max-h-32 min-h-[40px]"
          />

          <div className="mt-1 flex items-center justify-end">
            {/* ── Tombol upload gambar dinonaktifkan ── */}
            {/* <Button type="button" size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()} ... > */}
            {/*   <LuImage className="size-4" /> */}
            {/* </Button> */}

            {/* ── Model switcher dinonaktifkan ── */}
            {/* <Popover open={modelOpen} onOpenChange={setModelOpen}> ... </Popover> */}

            <Button
              type="submit"
              size="icon"
              disabled={!canSubmit}
              className="size-9 rounded-xl transition-all duration-200 disabled:opacity-40"
              aria-label="Kirim pesan"
            >
              {isLoading ? (
                <LuLoader className="size-4 animate-spin" />
              ) : (
                <LuSend className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </Field>
    </form>
  );
}
