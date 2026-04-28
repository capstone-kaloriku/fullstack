'use client';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { Button } from "@/components/ui/button";

import Link from "next/link";

import { EyeClosed, Lock, Mail, User } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaBirthdayCake } from "react-icons/fa";

const formSchema = z.object({
  gender: z.enum(["laki-laki", "perempuan"], "Jenis kelamin harus dipilih"),
  weight: z.coerce.number<number>().min(1, "Berat badan harus diisi"),
  height: z.coerce.number<number>().min(1, "Tinggi badan harus diisi"),
  age: z.coerce.number<number>().min(1, "Usia harus diisi"),
  username: z.string().min(2, "Nama user harus diisi"),
  email: z.email("Format email tidak valid").min(1, "Email harus diisi"),
  password: z.string().min(8, "Kata sandi harus minimal 8 karakter"),
  confirmPassword: z.string().min(8, "Konfirmasi kata sandi harus minimal 8 karakter")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Kata sandi dan konfirmasi kata sandi harus sama",
})

type FormValues = z.infer<typeof formSchema>;

function RegisterInput() {

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "laki-laki",
      weight: 0,
      height: 0,
      age: 0,
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  function onSubmit(data: FormValues) {
    console.log(data)
  }

  function onInvalid(errors: unknown) {
    console.log("Formulir kosong", errors)
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
        <FieldSet>
          <FieldGroup>
            <Controller name="gender" control={form.control} render={({ field, fieldState }) => (
              <Field >
                <FieldLabel htmlFor="gender">Jenis Kelamin</FieldLabel>
                <ToggleGroup
                  value={field.value ? [field.value] : []}
                  onValueChange={(values) => field.onChange(values[0] ?? "")}
                  className="flex rounded-2xl items-center justify-center mx-auto w-full"
                  spacing={2}
                >
                  <ToggleGroupItem value="laki-laki" className="flex-1 border border-primary aria-pressed:bg-primary aria-pressed:text-secondary" variant={"outline"} >
                    Laki Laki
                  </ToggleGroupItem>
                  <ToggleGroupItem value="perempuan" className="flex-1 border border-primary aria-pressed:bg-primary aria-pressed:text-secondary " variant={"outline"}>
                    Perempuan
                  </ToggleGroupItem>
                </ToggleGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />
            <Controller name="age" control={form.control} render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="age">Usia</FieldLabel>
                <InputGroup className="rounded-full px-4 py-6">
                  <InputGroupInput
                    id="age"
                    type="number"
                    placeholder="Usia"
                    {...field}
                  />
                  <InputGroupAddon align="inline-start">
                    <FaBirthdayCake size={20} />
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>Masukkan usia Anda</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />

            <div className="grid grid-cols-2 w-full gap-4">
              <Controller name="weight" control={form.control} render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="weight">Berat Badan</FieldLabel>
                  <InputGroup className="rounded-full px-4 py-6">
                    <InputGroupInput
                      id="weight"
                      type="number"
                      placeholder="0"
                      {...field}
                    />
                    <InputGroupAddon align="inline-end">
                      <span className="text-muted-foreground">KG</span>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>Masukkan berat badan Anda</FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )} />

              <Controller name="height" control={form.control} render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="height">Tinggi Badan</FieldLabel>
                  <InputGroup className="rounded-full px-4 py-6">
                    <InputGroupInput
                      id="height"
                      type="number"
                      placeholder="0"
                      {...field}
                    />
                    <InputGroupAddon align="inline-end">
                      <span className="text-muted-foreground">CM</span>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>Masukkan tinggi badan Anda</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )} />
            </div>
            <Controller name="username" control={form.control} render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="username">Nama User</FieldLabel>
                <InputGroup className="rounded-full px-4 py-6">
                  <InputGroupInput
                    id="username"
                    type="text"
                    placeholder="Nama User"
                    {...field}
                  />
                  <InputGroupAddon align="inline-start">
                    <User size={20} />
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>Masukkan nama pengguna Anda</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />

            <Controller name="email" control={form.control} render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <InputGroup className="rounded-full px-4 py-6">
                  <InputGroupInput id="email" type="text" placeholder="Email" {...field} />
                  <InputGroupAddon align="inline-start">
                    <Mail size={20} />
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>Masukkan email Anda</FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />

            <Controller name="password" control={form.control} render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
                <InputGroup className="rounded-full px-4 py-6">
                  <InputGroupInput
                    id="password"
                    type="password"
                    placeholder="Kata Sandi"
                    {...field}

                  />
                  <InputGroupAddon align="inline-start">
                    <Lock size={20} />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <EyeClosed size={20} />
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>Masukkan kata sandi sebanyak 8 karakter</FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />

            <Controller name="confirmPassword" control={form.control} render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Konfirmasi Password
                </FieldLabel>
                <InputGroup className="rounded-full px-4 py-6">
                  <InputGroupInput
                    id="confirmPassword"
                    type="password"
                    placeholder="Konfirmasi Password"
                    {...field}
                  />
                  <InputGroupAddon align="inline-start">
                    <Lock size={20} />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <EyeClosed size={20} />
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>Konfirmasi Password anda</FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )} />


            <Button type="submit" className="w-full py-6">Daftar</Button>

            <span className="text-sm md:text-lg text-muted-foreground text-center my-4">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary underline font-medium">
                Login Sekarang
              </Link>
            </span>
          </FieldGroup>
        </FieldSet >
      </form>
    </>
  );
}

export default RegisterInput;
