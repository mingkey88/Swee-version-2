'use client';

import { useActionState } from 'react';
import { signUpMerchant } from '@/app/(auth)/actions';
import { FormAlert } from '@/components/form-alert';
import { FieldError, SelectField, TextField } from '@/components/form-field';
import { SubmitButton } from '@/components/submit-button';
import { Separator } from '@/components/ui/separator';
import { AREAS, CATEGORIES, CATEGORY_LABELS } from '@/lib/constants';

const categoryOptions = CATEGORIES.map(value => ({
  value,
  label: CATEGORY_LABELS[value],
}));
const areaOptions = AREAS.map(value => ({ value, label: value }));

export function BusinessSignUpForm() {
  const [state, action] = useActionState(signUpMerchant, undefined);
  const values = state?.values;
  const errors = state?.fieldErrors;
  return (
    <form action={action} className="grid gap-4" noValidate>
      <FormAlert message={state?.error} />

      <fieldset className="grid gap-4">
        <legend className="mb-2 text-sm font-semibold">Your business</legend>
        <TextField
          name="businessName"
          label="Business name"
          autoComplete="organization"
          required
          defaultValue={values?.businessName}
          errors={errors?.businessName}
        />
        <SelectField
          name="category"
          label="Main category"
          placeholder="Choose a category"
          options={categoryOptions}
          required
          defaultValue={values?.category ?? ''}
          errors={errors?.category}
        />
        <SelectField
          name="area"
          label="Neighbourhood"
          placeholder="Choose a neighbourhood"
          options={areaOptions}
          required
          defaultValue={values?.area ?? ''}
          errors={errors?.area}
        />
        <TextField
          name="address"
          label="Address"
          autoComplete="street-address"
          required
          defaultValue={values?.address}
          errors={errors?.address}
        />
        <div className="grid gap-1.5">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="isHomeBased"
              defaultChecked={values?.isHomeBased === 'on'}
              className="accent-primary mt-0.5 size-4"
            />
            <span>
              I run a home-based business
              <span className="text-muted-foreground block">
                Many freelance facialists and nail artists do.
              </span>
            </span>
          </label>
          <FieldError id="isHomeBased" errors={errors?.isHomeBased} />
        </div>
      </fieldset>

      <Separator />

      <fieldset className="grid gap-4">
        <legend className="mb-2 text-sm font-semibold">Your login</legend>
        <TextField
          name="name"
          label="Your name"
          autoComplete="name"
          required
          defaultValue={values?.name}
          errors={errors?.name}
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          defaultValue={values?.email}
          errors={errors?.email}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          hint="At least 8 characters."
          errors={errors?.password}
        />
      </fieldset>

      <SubmitButton pendingText="Creating your business…">
        Create business account
      </SubmitButton>
    </form>
  );
}
