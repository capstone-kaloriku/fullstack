'use client';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { Button } from "@/components/ui/button";

import Link from "next/link";

import { EyeClosed, Lock, Mail } from "lucide-react";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z
  .object({
    email: z
      .email("Format email tidak valid")
      .min(1, "Email harus diisi"),
    password: z.string().min(8, "Kata sandi harus minimal 8 karakter"),
    confirmPassword: z
      .string()
      .min(8, "Konfirmasi kata sandi harus minimal 8 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi dan konfirmasi kata sandi harus sama",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

function ResetPassword() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  function onInvalid(errors: unknown) {
    console.log("Formulir kosong", errors);
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
        <FieldSet>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <InputGroup className="rounded-full px-4 py-6">
                    <InputGroupInput
                      id="email"
                      type="email"
                      placeholder="Email"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    <InputGroupAddon align="inline-start">
                      <Mail size={20} />
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Gunakan email yang terdaftar di akun Anda.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="password">Kata Sandi Baru</FieldLabel>
                  <InputGroup className="rounded-full px-4 py-6">
                    <InputGroupInput
                      id="password"
                      type="password"
                      placeholder="Kata Sandi Baru"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    <InputGroupAddon align="inline-start">
                      <Lock size={20} />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <EyeClosed size={20} />
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Minimal 8 karakter dengan kombinasi huruf dan angka.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Konfirmasi Kata Sandi
                  </FieldLabel>
                  <InputGroup className="rounded-full px-4 py-6">
                    <InputGroupInput
                      id="confirmPassword"
                      type="password"
                      placeholder="Konfirmasi Kata Sandi"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    <InputGroupAddon align="inline-start">
                      <Lock size={20} />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <EyeClosed size={20} />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" className="w-full py-6">
              Atur Ulang Kata Sandi
            </Button>

            <span className="text-sm md:text-base text-muted-foreground text-center my-4">
              Sudah ingat kata sandi?{" "}
              <Link href="/login" className="text-primary underline font-medium">
                Login Sekarang
              </Link>
            </span>
          </FieldGroup>
        </FieldSet>
      </form>
    </>
  );
}

export default ResetPassword;
