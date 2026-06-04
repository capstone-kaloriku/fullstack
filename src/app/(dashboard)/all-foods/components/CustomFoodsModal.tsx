"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { AIValidationResult } from "@/actions/custom-food";
import { saveCustomFood } from "@/actions/custom-food";

import { useState } from "react";
import { toast } from "sonner";
import {
  Flame,
  Leaf,
  Wheat,
  Droplets,
  CheckCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface ModalsProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  foodTitle: string;
  foodDescription: string;
  foodImage: string;
  validationData?: AIValidationResult | null;
  uploadedImageUrl?: string;
  isValidating?: boolean;
  onSaveSuccess?: () => void;
}

// ── Nutrition stat card ──
function NutriStat({
  icon: Icon,
  label,
  value,
  unit,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-1 rounded-xl p-3 ${color}`}>
      <Icon className="size-4 opacity-80" />
      <span className="text-base font-bold tabular-nums">{value}</span>
      <span className="text-[10px] font-medium opacity-70">
        {label} ({unit})
      </span>
    </div>
  );
}

function CustomFoodsModal({
  isOpen,
  onClose,
  foodTitle,
  foodDescription,
  foodImage,
  validationData,
  uploadedImageUrl,
  isValidating = false,
  onSaveSuccess,
}: ModalsProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!validationData) return;

    setIsSaving(true);
    try {
      const result = await saveCustomFood({
        nama: validationData.nama,
        calories: validationData.calories,
        protein_gram: validationData.protein_gram,
        carbs_gram: validationData.carbs_gram,
        fat_gram: validationData.fat_gram,
        base_portion_gram: validationData.base_portion_gram,
        category: validationData.category,
        image_url: uploadedImageUrl,
      });

      if (result.success) {
        toast.success("Berhasil!", {
          description: `${validationData.nama} telah disimpan ke daftar makanan.`,
        });
        onSaveSuccess?.();
        onClose(false);
      } else {
        toast.error("Gagal menyimpan", {
          description: result.error,
        });
      }
    } catch {
      toast.error("Terjadi kesalahan", {
        description: "Gagal menyimpan makanan. Silakan coba lagi.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const displayImage = foodImage || uploadedImageUrl;
  const aiData = validationData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {/* Food image header */}
          {displayImage && (
            <div className="relative -mx-6 -mt-6 h-44 overflow-hidden rounded-t-xl">
              {/* Gunakan <img> biasa agar blob URL (preview lokal) dan GCS URL keduanya tampil */}
              <img
                src={displayImage}
                alt={aiData?.nama || foodTitle}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (uploadedImageUrl && target.src !== uploadedImageUrl) {
                    target.src = uploadedImageUrl;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Confidence badge overlay */}
              {aiData && (
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <Badge
                    variant="default"
                    className="backdrop-blur-sm bg-primary/90 gap-1"
                  >
                    <Sparkles className="size-3" />
                    AI Confidence: {aiData.confidence}%
                  </Badge>
                </div>
              )}
            </div>
          )}

          <DialogTitle className="flex items-center gap-2 pt-1">
            <CheckCircle className="size-5 text-primary shrink-0" />
            {isValidating ? "Memvalidasi dengan AI..." : "Validasi Makanan"}
          </DialogTitle>
          <DialogDescription>
            {isValidating
              ? "Sedang menganalisis makanan dengan AI, mohon tunggu..."
              : "Berikut hasil validasi AI. Periksa dan simpan jika informasinya sudah benar."}
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-4 scrollbar-none max-h-[50vh] overflow-auto px-4">
          {isValidating ? (
            /* Loading state while AI validates */
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-1/3 rounded-md" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-2/5 rounded-md" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            </div>
          ) : aiData ? (
            /* AI validation result */
            <div className="flex flex-col gap-4 py-2">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="validated-name">Nama Makanan</FieldLabel>
                  <Input
                    disabled
                    id="validated-name"
                    name="name"
                    defaultValue={aiData.nama}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="validated-desc">Deskripsi</FieldLabel>
                  <Textarea
                    id="validated-desc"
                    name="description"
                    defaultValue={aiData.deskripsi || foodDescription}
                    disabled
                    className="min-h-[72px] resize-none"
                  />
                  <FieldDescription>
                    Deskripsi otomatis dari AI
                  </FieldDescription>
                </Field>
              </FieldGroup>

              <Separator />

              {/* Nutrition grid */}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-foreground">
                  Estimasi Nutrisi
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    per porsi ({aiData.base_portion_gram}g)
                  </span>
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <NutriStat
                    icon={Flame}
                    label="Kalori"
                    value={aiData.calories}
                    unit="kcal"
                    color="bg-primary/8 text-primary"
                  />
                  <NutriStat
                    icon={Leaf}
                    label="Protein"
                    value={aiData.protein_gram}
                    unit="g"
                    color="bg-emerald-500/8 text-emerald-600"
                  />
                  <NutriStat
                    icon={Wheat}
                    label="Karbo"
                    value={aiData.carbs_gram}
                    unit="g"
                    color="bg-amber-500/8 text-amber-600"
                  />
                  <NutriStat
                    icon={Droplets}
                    label="Lemak"
                    value={aiData.fat_gram}
                    unit="g"
                    color="bg-blue-500/8 text-blue-600"
                  />
                </div>
              </div>

              {/* Category tag */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Kategori:</span>
                <Badge variant="outline" className="capitalize">
                  {aiData.category.replace(/_/g, " ")}
                </Badge>
              </div>
            </div>
          ) : (
            /* Fallback: show original form data */
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nama Makanan</FieldLabel>
                <Input
                  disabled
                  id="name"
                  name="name"
                  defaultValue={foodTitle}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Deskripsi Makanan</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={foodDescription}
                />
              </Field>
            </FieldGroup>
          )}
        </div>

        <DialogFooter>
          <DialogClose
            nativeButton={true}
            render={(props) => (
              <Button {...props} variant="outline" disabled={isSaving}>
                Batal
              </Button>
            )}
          />
          <Button
            onClick={handleSave}
            disabled={isSaving || isValidating || !aiData}
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" data-icon="inline-start" />
                Menyimpan...
              </>
            ) : (
              "Simpan Makanan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CustomFoodsModal;
