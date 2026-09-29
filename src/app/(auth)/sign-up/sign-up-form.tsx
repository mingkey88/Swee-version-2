'use client';

import { useActionState } from 'react';
import { signUpCustomer } from '@/app/(auth)/actions';
import { FormAlert } from '@/components/form-alert';
import { TextField } from '@/components/form-field';
import { SubmitButton } from '@/components/submit-button';

export function SignUpForm() {
  const [state, action] = useActionState(signUpCustomer, undefined);
  return (
    <form action={action} className="grid gap-4" noValidate>
      <FormAlert message={state?.error} />
      <TextField
        name="name"
        label="Name"
        autoComplete="name"
        required
        defaultValue={state?.values?.name}
        errors={state?.fieldErrors?.name}
      />
      <TextField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state?.values?.email}
        errors={state?.fieldErrors?.email}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        required
        hint="At least 8 characters."
        errors={state?.fieldErrors?.password}
      />
      <SubmitButton pendingText="Creating account…">
        Create account
      </SubmitButton>
    </form>
  );
}
