'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const formSchema = z.object({
  foodNames: z.string().min(1, "Nama makanan harus diisi"),
  portions: z.number().min(0.1, "Porsi harus lebih dari 0")
});

type FormValues = z.infer<typeof formSchema>;

function CustomFood() {

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodNames: "",
      portions: 0
    }
  })

  function onSubmit(data: FormValues) {
    console.log(data)
  }

  function onInvalid(errors: unknown) {
    console.log("Form validation errors:", errors)
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
                <Button type="submit">Submit</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default CustomFood