'use client';

import { useActionState } from 'react';
import { signIn } from '@/app/(auth)/actions';
import { FormAlert } from '@/components/form-alert';
import { TextField } from '@/components/form-field';
import { SubmitButton } from '@/components/submit-button';

export function SignInForm() {
  const [state, action] = useActionState(signIn, undefined);
  return (
    <form action={action} className="grid gap-4" noValidate>
      <FormAlert message={state?.error} />
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
        autoComplete="current-password"
        required
        errors={state?.fieldErrors?.password}
      />
      <SubmitButton pendingText="Signing in…">Sign in</SubmitButton>
    </form>
  );
}
