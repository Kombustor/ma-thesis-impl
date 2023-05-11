import { Form } from 'react-daisyui';

import LinkInput from '@/components/article/admin/form/LinkInput';
import SubmitButton from '@/components/article/admin/form/SubmitButton';
import { useZodForm } from '@/components/hooks/useZodForm';

import {
  ArticleLinkSchema,
  ArticleLinkSchemaType,
} from '@mbg/api-platform/schemas/article.schema';

export type Props = {
  onSubmit: (data: ArticleLinkSchemaType) => void;
  classNames: string;
  disabled: boolean;
};

export default function LinkForm({ onSubmit, classNames, disabled }: Props) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useZodForm({
    schema: ArticleLinkSchema,
  });

  return (
    <Form className={classNames} onSubmit={handleSubmit(onSubmit)}>
      <LinkInput registerReturn={register('link')} />
      <SubmitButton
        disabled={isSubmitting || disabled}
        loading={isSubmitting}
        text="Load & Add Article"
      />
    </Form>
  );
}
