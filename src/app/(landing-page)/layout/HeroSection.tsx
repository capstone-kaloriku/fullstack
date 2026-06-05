"use client";

import { FadeUpPyramid } from "@/components/animations/FadeUpPyramid";
import { Button } from "@/components/ui/button";
import GlassSurface from "@/components/GlassSurface";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { LuSend, LuLoader, LuSparkles } from "react-icons/lu";
import { Textarea } from "@/components/ui/textarea";

function HeroSection() {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const params = new URLSearchParams({ prompt: trimmed });
        router.push(`/ai?${params.toString()}`);
      } else {
        const params = new URLSearchParams({
          redirect: `/ai`,
          prompt: trimmed,
        });
        router.push(`/login?${params.toString()}`);
      }
    } catch {
      const params = new URLSearchParams({
        redirect: `/ai`,
        prompt: prompt.trim(),
      });
      router.push(`/login?${params.toString()}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  };

  const canSubmit = !isSubmitting && prompt.trim().length > 0;

  return (
    <>
      <FadeUpPyramid position="center" delay={0.05}>
        <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-3xl lg:text-6xl dark:text-neutral-100">
          Kendalikan <span className="text-primary">Kalori</span> harianmu,
          dengan <span className="text-primary">KaloriKu.</span>
        </h2>
      </FadeUpPyramid>
      <FadeUpPyramid position="center" delay={0.05}>
        <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
          Pendamping setia untuk perjalanan hidup sehatmu. Tracking nutrisi
          presisi untuk bantu kamu mencapai target berat badan lebih efektif.
        </p>
      </FadeUpPyramid>

      <FadeUpPyramid position="center" delay={0.15}>
        <div className="relative z-10 mx-auto mt-8 w-full max-w-3xl px-4">
          <GlassSurface
            mixBlendMode="screen"
            width="100%"
            height="auto"
            borderRadius={32}
            borderWidth={0.08}
            brightness={0.5}
            opacity={0.2}
            blur={14}
            backgroundOpacity={0.08}
            saturation={1.2}
            className="hero-prompt-glass"
          >
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-2 p-1"
            >
              {/* Textarea */}
              <Textarea
                ref={textareaRef}
                value={prompt}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Tanya tentang kalori, nutrisi, atau pola makan sehat..."
                rows={2}
                aria-label="Prompt input"
                id="hero-prompt-input"
                className="hero-prompt-textarea w-full resize-none bg-transparent px-3 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                style={{
                  minHeight: "150px",
                  maxHeight: "160px",
                }}
              />

              {/* Bottom toolbar */}
              <div className="flex items-center justify-between px-2 pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                    <LuSparkles className="size-3" />
                    KalorAI
                  </span>
                </div>

                <Button
                  type="submit"
                  size="icon"
                  disabled={!canSubmit}
                  className="size-8 rounded-xl transition-all duration-200 disabled:opacity-30"
                  aria-label="Kirim prompt"
                  id="hero-prompt-submit"
                >
                  {isSubmitting ? (
                    <LuLoader className="size-3.5 animate-spin" />
                  ) : (
                    <LuSend className="size-3.5" />
                  )}
                </Button>
              </div>
            </form>
          </GlassSurface>

          {/* Subtle hint below */}
          <p className="mt-3 text-center text-[11px] text-muted-foreground/50">
            Tekan{" "}
            <kbd className="rounded border border-muted-foreground/20 px-1 py-0.5 text-[10px] font-mono">
              Enter
            </kbd>{" "}
            untuk kirim ·{" "}
            <kbd className="rounded border border-muted-foreground/20 px-1 py-0.5 text-[10px] font-mono">
              Shift+Enter
            </kbd>{" "}
            baris baru
          </p>
        </div>
      </FadeUpPyramid>
    </>
  );
}

export default HeroSection;
