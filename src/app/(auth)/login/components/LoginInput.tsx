'use client'
import {
  Field,
  FieldGroup,
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

import { FaGoogle } from "react-icons/fa";
import { EyeClosed, EyeIcon, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const formSchema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(8, "Kata sandi harus minimal 8 karakter")
});

type FormValues = z.infer<typeof formSchema>;


function LoginInput() {

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup className="rounded-full px-4 py-6">
              <InputGroupInput id="email" type="text" placeholder="Email" />
              <InputGroupAddon>
                <Mail size={20} />
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
            <InputGroup className="rounded-full px-4 py-6">
              <InputGroupInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Kata Sandi"
              />
              <InputGroupAddon align="inline-start">
                <Lock size={20} />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                {
                  showPassword ? (
                    <EyeIcon size={20} onClick={togglePasswordVisibility} className="cursor-pointer" />
                  ) : (
                    <EyeClosed size={20} onClick={togglePasswordVisibility} className="cursor-pointer" />
                  )
                }
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Link
            href="/reset-password"
            className="text-sm text-secondary-foreground flex justify-end"
          >
            Lupa Password?
          </Link>
          <Button
            nativeButton={false}
            render={<Link href="/dashboard" />}
            className="w-full py-6"
          >
            Masuk
          </Button>
          <FieldSeparator className="my-3 h-3 justify-center text-sm text-secondary">
            ATAU MASUK DENGAN
          </FieldSeparator>

          <Button variant="outline" className="w-full py-6">
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
    </>
  );
}

export default LoginInput;
