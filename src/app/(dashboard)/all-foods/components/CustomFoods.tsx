"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import { UploadCloud, Loader2, Sparkles } from "lucide-react";
import type { AIValidationResult } from "@/actions/custom-food";
import { processCustomFood } from "@/actions/custom-food";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const customFoodSchema = z.object({
  imgUrl: z
    .custom<File>((val) => val instanceof File, "Gambar harus diinput")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      "Gambar harus berupa JPG, JPEG, atau PNG",
    ),
  title: z
    .string()
    .min(5, "Nama makanan harus jelas")
    .max(50, "Nama makanan maksimal 50 karakter"),
  description: z
    .string()
    .min(5, "Deskripsi makanan harus jelas")
    .max(255, "Deskripsi makanan maksimal 255 karakter"),
});

interface CustomFoodsProps {
  openModal: () => void;
  onFormChange: (title: string, imageUrl: string, description: string) => void;
  onValidationComplete: (data: AIValidationResult, imageUrl?: string) => void;
  onValidationStart: () => void;
}

function CustomFoods({
  openModal,
  onFormChange,
  onValidationComplete,
  onValidationStart,
}: CustomFoodsProps) {
  const form = useForm<z.infer<typeof customFoodSchema>>({
    resolver: zodResolver(customFoodSchema),
    defaultValues: {
      imgUrl: undefined,
      title: "",
      description: "",
    },
  });

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleValue = form.watch("title");
  const descriptionValue = form.watch("description");

  useEffect(() => {
    onFormChange(titleValue, previewUrl, descriptionValue);
  }, [titleValue, previewUrl, descriptionValue, onFormChange]);

  const onSubmit = async (data: z.infer<typeof customFoodSchema>) => {
    setIsSubmitting(true);
    onValidationStart();
    openModal();

    try {
      // Prepare FormData for image upload
      const formData = new FormData();
      formData.append("file", data.imgUrl);

      // Call the server action that handles upload + AI validation
      const result = await processCustomFood(formData, data.title);

      if (result.success && result.validation) {
        onValidationComplete(result.validation, result.imageUrl);
      } else {
        toast.error("Validasi gagal", {
          description:
            result.error || "AI tidak dapat memvalidasi makanan ini.",
        });
      }
    } catch (error) {
      console.error("Error processing custom food:", error);
      toast.error("Terjadi kesalahan", {
        description: "Gagal memproses makanan. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card size="sm" className="h-full w-full flex flex-col gap-5">
      <CardHeader>
        <h1 className="text-2xl font-bold text-primary">Tambah Makanan</h1>
        <CardDescription>
          Tidak nemu makanan kamu? kamu bisa masukkin makanan kamu hari ini loh
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="imgUrl"
              control={form.control}
              render={({
                field: { value, onChange, ...fieldRest },
                fieldState,
              }) => (
                <Field>
                  <FieldLabel data-invalid={fieldState.invalid}>
                    Foto Makanan
                  </FieldLabel>
                  <div className="mt-2 flex justify-center w-full">
                    <FieldLabel
                      htmlFor="food-image-upload"
                      className={`relative flex flex-col items-center justify-center w-full max-w-[280px] aspect-square border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden group ${
                        fieldState.invalid
                          ? "border-destructive bg-destructive/5"
                          : "border-muted-foreground/30 hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      {previewUrl ? (
                        <>
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-sm font-medium flex items-center gap-2">
                              <UploadCloud className="size-5" /> Ganti Gambar
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground group-hover:text-primary transition-colors">
                          <div className="p-4 rounded-full bg-muted group-hover:bg-primary/10 mb-4 transition-colors">
                            <UploadCloud className="size-8" />
                          </div>
                          <span className="text-sm font-semibold mb-1">
                            Klik untuk upload gambar
                          </span>
                          <span className="text-xs opacity-70">
                            Mendukung JPG, JPEG, PNG
                          </span>
                        </div>
                      )}
                      <Input
                        id="food-image-upload"
                        type="file"
                        accept="image/jpeg, image/png, image/jpg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file || undefined);

                          if (previewUrl) {
                            URL.revokeObjectURL(previewUrl);
                          }

                          if (file) {
                            setPreviewUrl(URL.createObjectURL(file));
                          } else {
                            setPreviewUrl("");
                          }
                        }}
                        {...fieldRest}
                      />
                    </FieldLabel>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel data-invalid={fieldState.invalid}>
                    Nama Makanan
                  </FieldLabel>
                  <Input
                    className="border-gray-300"
                    aria-invalid={fieldState.invalid}
                    placeholder="Contoh: Nasi Goreng Ayam"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel data-invalid={fieldState.invalid}>
                    Jelaskan Makananmu
                  </FieldLabel>
                  <Textarea
                    className="border-gray-300  h-32"
                    placeholder="Contoh: Nasi goreng ayam, aku makan dengan sayuran dan ayam"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                  Memvalidasi...
                </>
              ) : (
                <>
                  <Sparkles data-icon="inline-start" />
                  Validasi dengan AI
                </>
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export default CustomFoods;
