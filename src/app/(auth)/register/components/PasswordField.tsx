'use client';

import { useState } from 'react';
import { Controller, type Control, type FieldValues, type FieldError as RHFFieldError } from 'react-hook-form';
import { Eye, EyeClosed, Lock } from 'lucide-react';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

/**
 * Password field with built-in show/hide toggle.
 * Encapsulates toggle state internally — parent doesn't need to manage it.
 *
 * Uses loose typing (Control<FieldValues>) to avoid RHF v7 generic issues.
 * Type safety is enforced by the Zod schema at runtime.
 */
interface PasswordFieldProps {
  name: string;
  control: Control<FieldValues>;
  label: string;
  description: string;
  id: string;
  placeholder?: string;
}

function PasswordField({
  name,
  control,
  label,
  description,
  id,
  placeholder,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <InputGroup className="rounded-full px-4 py-6">
            <InputGroupInput
              id={id}
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder ?? label}
              {...field}
            />
            <InputGroupAddon align="inline-start">
              <Lock size={20} />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
              </button>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>{description}</FieldDescription>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error as RHFFieldError]} />
          )}
        </Field>
      )}
    />
  );
}

export default PasswordField;
