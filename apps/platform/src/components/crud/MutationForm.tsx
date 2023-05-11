/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Button, Form } from 'react-daisyui';
import {
  Control,
  RegisterOptions,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { z } from 'zod';

import ModifyButton from '@/components/crud/utils/ModifyButton';
import useModal from '@/components/hooks/useModal';
import { useZodForm } from '@/components/hooks/useZodForm';

import {
  InferMutationInput,
  TError,
  TMutation,
  trpc,
} from '@mbg/api-platform/lib/trpc';
import type { MutationSchema } from '@mbg/api-platform/lib/trpc/crud-mutation';

type FormFieldDefProps = {
  register: () => UseFormRegisterReturn;
  control: () => { control: Control; name: string };
};

export type FormFieldDef = {
  label: string;
  component: React.FC<FormFieldDefProps>;
  registerOptions?: Partial<RegisterOptions<any, any>>;
};

export type MutationFormProps<K extends TMutation, D extends z.ZodRawShape> = {
  name: string;

  mutationName: K;
  schema: MutationSchema<D>;
  existingId?: string;
  defaultValues?: InferMutationInput<K>;

  formFields: Record<keyof z.infer<z.ZodObject<D>>, FormFieldDef>;

  onSuccess?: () => void;
};

export default function MutationForm<
  K extends TMutation,
  D extends z.ZodRawShape
>({
  name,
  mutationName,
  existingId,
  defaultValues,
  schema,
  onSuccess,
  formFields,
}: MutationFormProps<K, D>) {
  const { Modal, open, close } = useModal({});
  const [globalError, setGlobalError] = useState<string>();

  // Get mutation
  const mutation = trpc.useMutation(mutationName);

  // Initialize zod react-hook-form
  const {
    control,
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useZodForm({
    // Schema for the form is the data schema
    schema: schema.shape.data,
    defaultValues,
  });

  // FIXME when error message appears/disappears react rerenders and the input focus is lost

  return (
    <>
      <Modal
        trigger={<ModifyButton edit={!!existingId} onClick={open} />}
        header={defaultValues ? 'Edit' : 'Create' + ' ' + name}
      >
        <Form
          className="gap-2"
          onSubmit={handleSubmit(async (values) => {
            try {
              await mutation.mutateAsync({
                data: values,
                id: existingId,
              } as InferMutationInput<K>);
              reset();
              clearErrors();
              // eslint-disable-next-line unicorn/no-useless-undefined
              setGlobalError(undefined);

              close();
              onSuccess?.();
            } catch (error) {
              setGlobalError((error as TError).message);
            }
          })}
        >
          {globalError && <p className="text-red-700">{globalError}</p>}
          {Object.keys(formFields).map((key) => {
            const formFieldDef = formFields[key as keyof typeof formFields];
            const errorMessage = errors?.[key as keyof typeof errors]?.message;

            return (
              <div className="form-control w-full" key={key}>
                <label className="label">
                  <span className="label-text">{formFieldDef.label}</span>
                </label>
                {formFieldDef.component({
                  register: () => register(key, formFieldDef.registerOptions),
                  control: () => ({ control, name: key }),
                })}
                {errorMessage && (
                  <label className="label text-red-700">{errorMessage}</label>
                )}
              </div>
            );
          })}

          <Button
            className="mt-2"
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
          >
            Submit
          </Button>
        </Form>
      </Modal>
    </>
  );
}
