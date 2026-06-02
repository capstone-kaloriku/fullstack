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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const customFoodSchema = z.object({
  title: z
    .string()
    .min(5, "Nama makanan harus jelas")
    .max(50, "Nama makanan maksimal 50 karakter"),
  description: z
    .string()
    .min(5, "Deskripsi harus diisi")
    .max(50, "Deskripsi maksimal 50 karakter"),
});

interface CustomFoodsProps {
  openModal: () => void;
  onFormChange: (title: string, description: string) => void;
}

function CustomFoods({ openModal, onFormChange }: CustomFoodsProps) {
  const form = useForm<z.infer<typeof customFoodSchema>>({
    resolver: zodResolver(customFoodSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const titleValue = form.watch("title");
  const descriptionValue = form.watch("description");

  useEffect(() => {
    onFormChange(titleValue, descriptionValue);
  }, [titleValue, descriptionValue, onFormChange]);

  // Fajrin Siapkan fungsi AI nya wok
  const onSubmit = async (data: z.infer<typeof customFoodSchema>) => {
    try {
      console.log("Validasi data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      openModal();
    } catch (error) {
      console.error("Error validasi:", error);
    }
  };

  return (
    <Card size="sm" className="h-full w-full flex flex-col gap-5 my-6">
      <CardHeader>
        <h1 className="text-2xl font-bold text-primary">Custom Food</h1>
        <CardDescription>
          Kamu bisa menambahkan makananmu sendiri
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
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
                    Deskripsi
                  </FieldLabel>
                  <Textarea
                    className="border-gray-300"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button type="submit">Validasi dengan AI</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export default CustomFoods;
