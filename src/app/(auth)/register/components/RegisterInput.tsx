"use client";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Link from "next/link";

import {
  CalendarIcon,
  EyeClosed,
  EyeIcon,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, differenceInYears } from "date-fns";
import { id as idLocale } from "date-fns/locale/id";

import { useState } from "react";
import { cn } from "@/lib/utils";

function calculateAge(birthday: Date): number {
  return differenceInYears(new Date(), birthday);
}

const formSchema = z
  .object({
    gender: z.enum(["laki-laki", "perempuan"], "Jenis kelamin harus dipilih"),
    weight: z.coerce.number<number>().min(1, "Berat badan harus diisi"),
    height: z.coerce.number<number>().min(1, "Tinggi badan harus diisi"),
    birthday: z
      .date("Tanggal lahir harus dipilih")
      .refine(
        (date) => date <= new Date(),
        "Tanggal lahir tidak boleh di masa depan",
      )
      .refine((date) => calculateAge(date) >= 1, "Usia minimal 1 tahun")
      .refine((date) => calculateAge(date) <= 120, "Usia tidak valid"),
    username: z.string().min(2, "Nama user harus diisi"),
    email: z.email("Format email tidak valid").min(1, "Email harus diisi"),
    password: z.string().min(8, "Kata sandi harus minimal 8 karakter"),
    confirmPassword: z
      .string()
      .min(8, "Konfirmasi kata sandi harus minimal 8 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi dan konfirmasi kata sandi harus sama",
  });

type FormValues = z.infer<typeof formSchema>;

function RegisterInput() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "laki-laki",
      weight: 0,
      height: 0,
      birthday: undefined,
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: FormValues) {
    const age = calculateAge(data.birthday);
    console.log({ ...data, age });
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
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="gender">Jenis Kelamin</FieldLabel>
                  <ToggleGroup
                    value={field.value ? [field.value] : []}
                    onValueChange={(values) => field.onChange(values[0] ?? "")}
                    className="flex rounded-2xl items-center justify-center mx-auto w-full"
                    spacing={2}
                  >
                    <ToggleGroupItem
                      value="laki-laki"
                      className="flex-1 border border-primary aria-pressed:bg-primary aria-pressed:text-secondary"
                      variant={"outline"}
                    >
                      Laki Laki
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="perempuan"
                      className="flex-1 border border-primary aria-pressed:bg-primary aria-pressed:text-secondary "
                      variant={"outline"}
                    >
                      Perempuan
                    </ToggleGroupItem>
                  </ToggleGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="birthday"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="birthday">Tanggal Lahir</FieldLabel>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger
                      render={
                        <button
                          id="birthday"
                          type="button"
                          className={cn(
                            "flex items-center w-full rounded-full px-4 py-3.5 border border-input bg-background text-sm ring-offset-background transition-colors",
                            "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            !field.value && "text-muted-foreground",
                          )}
                        />
                      }
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-muted-foreground shrink-0" />
                      <span className="flex-1 text-left">
                        {field.value ? (
                          <>
                            {format(field.value, "dd MMMM yyyy", {
                              locale: idLocale,
                            })}
                            <span className="ml-2 text-muted-foreground">
                              ({calculateAge(field.value)} tahun)
                            </span>
                          </>
                        ) : (
                          "Pilih tanggal lahir"
                        )}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setCalendarOpen(false);
                        }}
                        captionLayout="dropdown"
                        defaultMonth={field.value || new Date(2000, 0)}
                        startMonth={new Date(1920, 0)}
                        endMonth={new Date()}
                        disabled={{ after: new Date() }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FieldDescription>
                    {field.value
                      ? `Usia Anda: ${calculateAge(field.value)} tahun`
                      : "Pilih tanggal lahir untuk menghitung usia"}
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 w-full gap-4">
              <Controller
                name="weight"
                control={form.control}
                render={({ field, fieldState }) => (
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
                    <FieldDescription>
                      Masukkan berat badan Anda
                    </FieldDescription>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="height"
                control={form.control}
                render={({ field, fieldState }) => (
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
                    <FieldDescription>
                      Masukkan tinggi badan Anda
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
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
                  <FieldDescription>
                    Masukkan nama pengguna Anda
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <InputGroup className="rounded-full px-4 py-6">
                    <InputGroupInput
                      id="email"
                      type="text"
                      placeholder="Email"
                      {...field}
                    />
                    <InputGroupAddon align="inline-start">
                      <Mail size={20} />
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>Masukkan email Anda</FieldDescription>

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
                  <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
                  <InputGroup className="rounded-full px-4 py-6">
                    <InputGroupInput
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Kata Sandi"
                      {...field}
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
                  <FieldDescription>
                    Masukkan kata sandi sebanyak 8 karakter
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
                    Konfirmasi Password
                  </FieldLabel>
                  <InputGroup className="rounded-full px-4 py-6">
                    <InputGroupInput
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Konfirmasi Password"
                      {...field}
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
                  <FieldDescription>Konfirmasi Password anda</FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" className="w-full py-6">
              Daftar
            </Button>

            <span className="text-sm md:text-lg text-muted-foreground text-center my-4">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-primary underline font-medium"
              >
                Login Sekarang
              </Link>
            </span>
          </FieldGroup>
        </FieldSet>
      </form>
    </>
  );
}

export default RegisterInput;
