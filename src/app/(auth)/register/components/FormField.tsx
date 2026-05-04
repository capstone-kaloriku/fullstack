'use client';

import { Controller, type Control, type FieldValues, type Path, type FieldError as RHFFieldError } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

/**
 * Reusable form field component for register/login forms.
 * Encapsulates the Controller + Field + InputGroup + Error pattern.
 *
 * Uses loose FieldValues typing to avoid RHF v7 generic propagation issues
 * with zodResolver. Type safety is enforced by the Zod schema at runtime.
 */
interface FormFieldProps {
  name: string;
  control: Control<FieldValues>;
  label: string;
  description: string;
  id: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  addonEnd?: React.ReactNode;
}

function FormField({
  name,
  control,
  label,
  description,
  id,
  type = 'text',
  placeholder,
  icon,
  addonEnd,
}: FormFieldProps) {
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
              type={type}
              placeholder={placeholder ?? label}
              {...field}
              value={field.value ?? ''}
            />
            {icon && (
              <InputGroupAddon align="inline-start">{icon}</InputGroupAddon>
            )}
            {addonEnd && (
              <InputGroupAddon align="inline-end">{addonEnd}</InputGroupAddon>
            )}
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

export default FormField;
