'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { logFoodConsumption } from "../../actions";

const formSchema = z.object({
  foodNames: z.string().min(1, "Nama makanan harus diisi"),
  portions: z.number().min(0.1, "Porsi harus lebih dari 0")
});

type FormValues = z.infer<typeof formSchema>;

function CustomFood() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodNames: "",
      portions: 0
    }
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const result = await logFoodConsumption({
        rawInputText: data.foodNames,
        portion: data.portions,
        mealType: 'custom',
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Gagal menyimpan data.');
        return;
      }

      setSuccessMessage(`"${data.foodNames}" berhasil dicatat!`);
      form.reset();
    } catch {
      setErrorMessage('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  }

  function onInvalid(errors: unknown) {
    console.log("Formulir kosong", errors)
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg text-secondary-foreground">Makan apa kamu hari ini?</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Kamu bisa memasukkan makanan yang belum ada di katalog untuk mendapatkan rekomendasi makanan serupa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Success Message */}
          {successMessage && (
            <div className="rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 text-sm px-4 py-3 mb-4">
              ✅ {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} >
            <FieldGroup>
              {/* Nama Makanan */}
              <Controller
                name="foodNames"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="foodNames" className="text-sm text-primary">
                      Nama Makanan
                    </FieldLabel>
                    <InputGroup className="border border-gray-400">
                      <InputGroupInput {...field} id="foodNames" type="text" />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller name="portions" control={form.control} render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="portions" className="text-sm text-primary">
                    Porsi
                  </FieldLabel>
                  <InputGroup className="border border-gray-400">
                    <InputGroupInput
                      id="portions"
                      min={0}
                      type="number"
                      value={field.value}
                      onChange={(event) => field.onChange(event.target.valueAsNumber)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )} />
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default CustomFood