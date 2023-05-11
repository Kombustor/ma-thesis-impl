import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ButtonGroup, Form } from 'react-daisyui';
import { Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useZodForm } from '@/components/hooks/useZodForm';
import StudyNextButton from '@/components/layout/StudyNextButton';
import ButtonWithLabel from '@/components/questions/RadioButtonQuestion/ButtonWithLabel';
import RadioQuestionsWrapper from '@/components/questions/RadioButtonQuestion/RadioQuestionWrapper';
import StudyLayout from '@/layouts/StudyLayout';
import { requireProgress } from '@/lib/progress';
import warningToast from '@/lib/warning-toast';

import { TError, trpc } from '@mbg/api-platform/lib/trpc';
import { StudyProgress } from '@mbg/api-platform/models/enums';
import { dataUsableForResearchSchema } from '@mbg/api-platform/schemas/participant.schema';

export const getServerSideProps: GetServerSideProps = requireProgress(
  StudyProgress.TRUST_CHECK_09
)();

export default function TrustCheck() {
  const router = useRouter();
  const setDataUsableForResearchForm = trpc.useMutation(
    'public-participant.set-data-usable-for-research',
    {
      onSuccess: (data) => {
        if (data) router.push('/10-end');
        else {
          warningToast('Your data will be not used for our research results.');
          setTimeout(() => {
            router.push('/10-end');
          }, 1000);
        }
      },
      onError: (error) => {
        toast.error((error as TError).message);
      },
    }
  );
  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting },
  } = useZodForm({
    schema: dataUsableForResearchSchema,
  });

  return (
    <StudyLayout
      progress={StudyProgress.TRUST_CHECK_09}
      nextButton={
        <StudyNextButton
          disabled={!isDirty || isSubmitting}
          loading={isSubmitting}
          type="submit"
          form="data-usable-for-research-form"
        />
      }
    >
      <Form
        id="data-usable-for-research-form"
        className="flex gap-4 p-10"
        onSubmit={handleSubmit(async (data) =>
          setDataUsableForResearchForm.mutateAsync(data)
        )}
      >
        <RadioQuestionsWrapper
          question="Can we trust your data for scientific research?"
          moreInfo={
            <h2 className="text-lg font-semibold">
              For example, if you failed to pay attention to some questions
              please answer &apos;No&apos;. Please answer honestly, you will
              receive full payment regardless of your answer.
            </h2>
          }
        >
          <Controller
            name={'dataUsableForResearch'}
            control={control}
            render={({ field: { onChange, ...props } }) => (
              <ButtonGroup vertical>
                <ButtonWithLabel
                  option="Yes, you can trust my data for scientific research"
                  onChange={() => onChange(true)}
                  {...props}
                />
                <ButtonWithLabel
                  option="No, you may not want to trust my data for scientific research"
                  onChange={() => onChange(false)}
                  {...props}
                />
              </ButtonGroup>
            )}
          />
        </RadioQuestionsWrapper>
      </Form>
    </StudyLayout>
  );
}
