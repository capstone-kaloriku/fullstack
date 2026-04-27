"use client";

import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Field } from "@/components/ui/field";
import { LuSend, LuLoader } from "react-icons/lu";

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

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="w-full"
    >
      <Field>
        <InputGroup className="rounded-2xl px-3 py-2 shadow-md bg-card ring-1 ring-foreground/5">
          <InputGroupTextarea
            placeholder="Tanya tentang kalori, nutrisi..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="max-h-32 min-h-[40px] resize-none text-sm"
            aria-label="Chat message input"
          />
          <InputGroupAddon align="inline-end">
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !value.trim()}
              className="size-9 rounded-xl transition-all duration-200 disabled:opacity-40"
              aria-label="Kirim pesan"
            >
              {isLoading ? (
                <LuLoader className="size-4 animate-spin" />
              ) : (
                <LuSend className="size-4" />
              )}
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </form>
  );
}
