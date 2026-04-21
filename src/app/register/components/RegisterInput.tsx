import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { Button } from "@/components/ui/button";

import Link from "next/link";

import { EyeClosed, Lock, Mail, User } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


function RegisterInput() {
  return (
    <>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="gender">Jenis Kelamin</FieldLabel>
            <ToggleGroup className="flex rounded-2xl items-center justify-center mx-auto w-full" spacing={2}>
              <ToggleGroupItem className="flex-1 border border-primary aria-pressed:bg-primary aria-pressed:text-secondary" variant={"outline"} >
                Laki Laki
              </ToggleGroupItem>
              <ToggleGroupItem className="flex-1 border border-primary aria-pressed:bg-primary aria-pressed:text-secondary " variant={"outline"}>
                Perempuan
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>
          <div className="grid grid-cols-2 w-full gap-4">
            <Field>
              <FieldLabel htmlFor="weight">Berat Badan</FieldLabel>
              <InputGroup className="rounded-full px-4 py-6">
                <InputGroupInput
                  id="weight"
                  type="number"
                  placeholder="0"
                />
                <InputGroupAddon align="inline-end">
                  <span className="text-muted-foreground">KG</span>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="height">Tinggi Badan</FieldLabel>
              <InputGroup className="rounded-full px-4 py-6">
                <InputGroupInput
                  id="height"
                  type="number"
                  placeholder="0"
                />
                <InputGroupAddon align="inline-end">
                  <span className="text-muted-foreground">CM</span>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="username">Nama User</FieldLabel>
            <InputGroup className="rounded-full px-4 py-6">
              <InputGroupInput
                id="username"
                type="text"
                placeholder="Nama User"
              />
              <InputGroupAddon align="inline-start">
                <User size={20} />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup className="rounded-full px-4 py-6">
              <InputGroupInput id="email" type="text" placeholder="Email" />
              <InputGroupAddon align="inline-start">
                <Mail size={20} />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
            <InputGroup className="rounded-full px-4 py-6">
              <InputGroupInput
                id="password"
                type="password"
                placeholder="Kata Sandi"
              />
              <InputGroupAddon align="inline-start">
                <Lock size={20} />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <EyeClosed size={20} />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">
              Konfirmasi Password
            </FieldLabel>
            <InputGroup className="rounded-full px-4 py-6">
              <InputGroupInput
                id="confirmPassword"
                type="password"
                placeholder="Konfirmasi Password"
              />
              <InputGroupAddon align="inline-start">
                <Lock size={20} />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <EyeClosed size={20} />
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Button className="w-full py-6">Daftar</Button>

          <span className="text-sm text-muted-foreground text-center my-4">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary underline font-medium">
              Login Sekarang
            </Link>
          </span>
        </FieldGroup>
      </FieldSet >
    </>
  );
}

export default RegisterInput;
