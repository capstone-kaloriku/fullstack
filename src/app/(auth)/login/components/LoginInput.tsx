'use client'
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { FaGoogle } from "react-icons/fa";
import { EyeClosed, EyeIcon, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(8, "Kata sandi harus minimal 8 karakter"),
});

type FormValues = z.infer<typeof formSchema>;


function LoginInput() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }

  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = (_values: FormValues) => {
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldSet>
        <FieldGroup>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup className="rounded-full px-4 py-6">
              <InputGroupInput
                id="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
              <InputGroupAddon>
                <Mail size={20} />
              </InputGroupAddon>
            </InputGroup>
            <FieldError id="email-error" errors={[errors.email]} />
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
            <InputGroup className="rounded-full px-4 py-6">
              <InputGroupInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Kata Sandi"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                {...register("password")}
              />
              <InputGroupAddon align="inline-start">
                <Lock size={20} />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                {showPassword ? (
                  <EyeIcon
                    size={20}
                    onClick={togglePasswordVisibility}
                    className="cursor-pointer"
                  />
                ) : (
                  <EyeClosed
                    size={20}
                    onClick={togglePasswordVisibility}
                    className="cursor-pointer"
                  />
                )}
              </InputGroupAddon>
            </InputGroup>
            <FieldError id="password-error" errors={[errors.password]} />
          </Field>
          <Link
            href="/forgot-password"
            className="text-sm text-secondary-foreground flex justify-end"
          >
            Lupa Password?
          </Link>
          <Button type="submit" className="w-full py-6">
            Masuk
          </Button>
          <FieldSeparator className="my-3 h-3 justify-center text-sm text-secondary">
            ATAU MASUK DENGAN
          </FieldSeparator>

          <Button variant="outline" className="w-full py-6" type="button">
            <FaGoogle size={20} />
            Google
          </Button>
          <span className="text-sm md:text-base text-muted-foreground text-center my-4">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-primary underline font-medium"
            >
              Daftar Sekarang
            </Link>
          </span>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

export default LoginInput;
