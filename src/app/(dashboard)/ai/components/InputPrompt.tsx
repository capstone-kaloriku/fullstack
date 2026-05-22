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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Field } from "@/components/ui/field";
import { LuSend, LuLoader, LuImage, LuX } from "react-icons/lu";
import { toast } from "sonner";

// Batas ukuran file gambar (5MB)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
// Tipe gambar yang diizinkan
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface InputPromptProps {
  // onSend sekarang menerima opsional image (base64 data URL)
  onSend: (message: string, image?: string) => void;
  isLoading: boolean;
}

export function InputPrompt({ onSend, isLoading }: InputPromptProps) {
  const [value, setValue] = useState("");
  // State untuk gambar yang di-attach (base64 data URL)
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Validasi tipe file
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }

    // Validasi ukuran file
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
      // Reset input agar bisa pilih file yang sama lagi
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setAttachedImage(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    // Boleh kirim kalau: ada teks, atau ada gambar (atau keduanya)
    if ((!trimmed && !attachedImage) || isLoading) return;

    // Kalau ada gambar tapi tidak ada teks, kasih default prompt agar AI tahu konteks
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

          <InputGroup className="border-0 shadow-none p-0">
            <InputGroupTextarea
              placeholder={
                attachedImage
                  ? "Tanya tentang gambar ini... (opsional)"
                  : "Tanya tentang kalori, nutrisi, atau upload foto makanan..."
              }
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="max-h-32 min-h-[40px] resize-none text-sm"
              aria-label="Chat message input"
            />
            <InputGroupAddon align="inline-end" className="gap-1">
              {/* Tombol attach gambar */}
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
            </InputGroupAddon>
          </InputGroup>
        </div>
      </Field>
    </form>
  );
}
