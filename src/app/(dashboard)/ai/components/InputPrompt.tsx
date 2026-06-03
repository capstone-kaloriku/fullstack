"use client";

import {
  useState,
  useRef,
  type FormEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  LuSend,
  LuLoader,
  LuImage,
  LuX,
  LuChevronDown,
  LuCheck,
  LuSparkles,
} from "react-icons/lu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Batas ukuran file gambar (5MB)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
// Tipe gambar yang diizinkan
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// ============================================
// Model options untuk switcher
// NutriAI = default (pakai Groq di backend, cepat & gratis)
// Opus 4.6 & DeepSeek V4 = coming soon (belum ada provider yang cocok)
// ============================================
type ModelId = "nutriai" | "opus-4-6" | "deepseek-v4";

interface ModelOption {
  id: ModelId;
  name: string;
  description: string;
  available: boolean;
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "nutriai",
    name: "NutriAI",
    description: "Default · cepat & spesialis nutrisi",
    available: true,
  },
  {
    id: "opus-4-6",
    name: "Opus 4.6",
    description: "Reasoning mendalam · coming soon",
    available: false,
  },
  {
    id: "deepseek-v4",
    name: "DeepSeek V4",
    description: "Open source · coming soon",
    available: false,
  },
];

interface InputPromptProps {
  onSend: (message: string, image?: string) => void;
  isLoading: boolean;
}

export function InputPrompt({ onSend, isLoading }: InputPromptProps) {
  const [value, setValue] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelId>("nutriai");
  const [modelOpen, setModelOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentModel =
    MODEL_OPTIONS.find((m) => m.id === selectedModel) ?? MODEL_OPTIONS[0];

  // Convert File ke base64 data URL untuk dikirim ke API
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Handle pemilihan file gambar
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Ukuran gambar maksimal 5MB.");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setAttachedImage(base64);
    } catch {
      toast.error("Gagal memproses gambar.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setAttachedImage(null);
  };

  // Pilih model — kalau belum tersedia, kasih toast & jangan ubah selection
  const handleSelectModel = (option: ModelOption) => {
    if (!option.available) {
      toast.info(`${option.name} belum tersedia. Tetap pakai NutriAI ya 😊`);
      setModelOpen(false);
      return;
    }
    setSelectedModel(option.id);
    setModelOpen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if ((!trimmed && !attachedImage) || isLoading) return;

    const finalMessage = trimmed || "Tolong analisis gambar ini.";
    onSend(finalMessage, attachedImage ?? undefined);
    setValue("");
    setAttachedImage(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const canSubmit = !isLoading && (value.trim().length > 0 || !!attachedImage);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="w-full">
      <Field>
        <div className="rounded-2xl px-3 py-2 shadow-md bg-card ring-1 ring-foreground/5">
          {/* Preview gambar yang di-attach (muncul di atas input) */}
          {attachedImage && (
            <div className="relative mb-2 inline-block">
              <Image
                src={attachedImage}
                alt="Gambar yang dilampirkan"
                width={80}
                height={80}
                className="size-20 rounded-lg object-cover ring-1 ring-border"
                unoptimized
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                aria-label="Hapus gambar"
                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-background shadow-md hover:bg-foreground/80 transition-colors"
              >
                <LuX className="size-3" />
              </button>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload gambar"
          />

          {/* Textarea — full width, tanpa toolbar inline */}
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              attachedImage
                ? "Tanya tentang gambar ini... (opsional)"
                : "Tanya tentang kalori, nutrisi, atau upload foto makanan..."
            }
            rows={1}
            aria-label="Chat message input"
            className="w-full resize-none bg-transparent px-1 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none max-h-32 min-h-[40px]"
          />

          {/* Toolbar bar di bawah textarea */}
          <div className="mt-1 flex items-center justify-between gap-2">
            {/* Kiri: tombol upload gambar */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || !!attachedImage}
              className="size-9 rounded-xl text-muted-foreground hover:text-foreground"
              aria-label="Lampirkan gambar"
              title="Upload foto makanan atau label gizi"
            >
              <LuImage className="size-4" />
            </Button>

            {/* Kanan: model switcher + tombol kirim */}
            <div className="flex items-center gap-1.5">
              {/* Model switcher */}
              <Popover open={modelOpen} onOpenChange={setModelOpen}>
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      disabled={isLoading}
                      aria-label="Pilih model AI"
                      title="Pilih model AI"
                      className={cn(
                        "flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-medium transition-colors",
                        "bg-muted/50 text-foreground hover:bg-muted",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      <LuSparkles className="size-3.5 text-primary" />
                      <span className="max-w-[80px] truncate">
                        {currentModel.name}
                      </span>
                      <LuChevronDown
                        className={cn(
                          "size-3.5 text-muted-foreground transition-transform",
                          modelOpen && "rotate-180"
                        )}
                      />
                    </button>
                  }
                />
                <PopoverContent
                  align="end"
                  side="top"
                  sideOffset={8}
                  className="w-64 p-1.5"
                >
                  <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Pilih Model
                  </div>
                  {MODEL_OPTIONS.map((option) => {
                    const isActive = option.id === selectedModel;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelectModel(option)}
                        className={cn(
                          "flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors",
                          "hover:bg-muted",
                          isActive && "bg-primary/5",
                          !option.available && "opacity-60"
                        )}
                      >
                        <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
                          {isActive ? (
                            <LuCheck className="size-4 text-primary" />
                          ) : (
                            <span className="size-2 rounded-full bg-muted-foreground/30" />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {option.name}
                            </span>
                            {!option.available && (
                              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Soon
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {option.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </PopoverContent>
              </Popover>

              {/* Tombol kirim */}
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
        </div>
      </Field>
    </form>
  );
}
