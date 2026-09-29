import type { ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export const fieldControlClass = 'h-10';

/** Error text shown under a field, linked to it with aria-describedby. */
export function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={`${id}-error`} className="text-destructive text-sm">
      {errors[0]}
    </p>
  );
}

type TextFieldProps = ComponentProps<'input'> & {
  name: string;
  label: string;
  errors?: string[];
  hint?: string;
};

export function TextField({
  name,
  label,
  errors,
  hint,
  className,
  defaultValue,
  ...props
}: TextFieldProps) {
  const id = props.id ?? name;
  const invalid = Boolean(errors?.length);
  // Always a string, so "nothing submitted yet" and "submitted empty" match.
  const initialValue = String(defaultValue ?? '');
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        // After a failed submit the form refills with the submitted value.
        // Remount instead of changing defaultValue, which Base UI warns about.
        key={initialValue}
        defaultValue={initialValue}
        id={id}
        name={name}
        aria-invalid={invalid || undefined}
        aria-describedby={
          invalid ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={cn(fieldControlClass, className)}
        {...props}
      />
      {hint && !invalid && (
        <p id={`${id}-hint`} className="text-muted-foreground text-sm">
          {hint}
        </p>
      )}
      <FieldError id={id} errors={errors} />
    </div>
  );
}

type SelectFieldProps = ComponentProps<'select'> & {
  name: string;
  label: string;
  options: readonly { value: string; label: string }[];
  placeholder: string;
  errors?: string[];
};

/** A native <select>: works without JavaScript and is accessible on mobile. */
export function SelectField({
  name,
  label,
  options,
  placeholder,
  errors,
  className,
  ...props
}: SelectFieldProps) {
  const id = props.id ?? name;
  const invalid = Boolean(errors?.length);
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={name}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={cn(
          'border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 w-full rounded-lg border bg-transparent px-2.5 text-base outline-none focus-visible:ring-3 aria-invalid:ring-3 md:text-sm',
          fieldControlClass,
          className
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError id={id} errors={errors} />
    </div>
  );
}
