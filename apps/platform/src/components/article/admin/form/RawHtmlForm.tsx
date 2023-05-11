import { Form, Textarea } from 'react-daisyui';

import { Props as LinkFormProps } from '@/components/article/admin/form/LinkForm';
import LinkInput from '@/components/article/admin/form/LinkInput';
import SubmitButton from '@/components/article/admin/form/SubmitButton';
import { useZodForm } from '@/components/hooks/useZodForm';

import { ArticleRawToParsedInputSchema } from '@mbg/api-platform/schemas/article.schema';

type Props = { link: string } & LinkFormProps;

export default function RawHtmlForm({
  onSubmit,
  link,
  classNames,
  disabled,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useZodForm({
    schema: ArticleRawToParsedInputSchema,
  });

  return (
    <Form
      className={classNames}
      onSubmit={handleSubmit(async (values) => {
        onSubmit(values);
      })}
    >
      <label>Link</label>
      <LinkInput link={link} registerReturn={register('link')} />
      <label>Raw HTML</label>
      <Textarea
        id="rawHtml"
        placeholder="<html>...</html>"
        className="textarea-info h-60"
        {...register('rawHtml')}
      />
      <SubmitButton disabled={isSubmitting || disabled} text="Add Article" />
    </Form>
  );
}
