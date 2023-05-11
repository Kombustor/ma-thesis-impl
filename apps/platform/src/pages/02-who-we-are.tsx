import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { Form, Toggle } from 'react-daisyui';
import toast from 'react-hot-toast';

import { useZodForm } from '@/components/hooks/useZodForm';
import StudyNextButton from '@/components/layout/StudyNextButton';
import MBGMail from '@/components/misc/MbgMail';
import TextContainer from '@/components/misc/TextContainer';
import StudyLayout from '@/layouts/StudyLayout';
import { requireProgress } from '@/lib/progress';

import { TError, trpc } from '@mbg/api-platform/lib/trpc';
import { StudyProgress } from '@mbg/api-platform/models/enums';
import { dataProcessingConsentSchema } from '@mbg/api-platform/schemas/participant.schema';

export const getServerSideProps: GetServerSideProps = requireProgress(
  StudyProgress.DATA_PROCESSING_02,
  StudyProgress.START_01
)();

export default function WhoWeArePage({
  prolificCompletionUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const setDataProcessingConsentMutation = trpc.useMutation(
    'public-participant.set-data-processing-consent',
    {
      onSuccess: (data) => {
        if (data) router.push('/03-questions');
        else {
          toast.error(
            'No data processing consent provided, redirecting to prolific.'
          );
          if (prolificCompletionUrl) {
            setTimeout(() => router.push(prolificCompletionUrl), 1000);
          }
        }
      },
      onError: (error) => {
        toast.error((error as TError).message);
      },
    }
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useZodForm({
    schema: dataProcessingConsentSchema,
  });

  return (
    <StudyLayout
      progress={StudyProgress.DATA_PROCESSING_02}
      nextButton={
        <StudyNextButton
          type="submit"
          form="data-processing-consent-form"
          disabled={isSubmitting || !watch('dataProcessingConsent')}
          loading={isSubmitting}
        />
      }
    >
      <TextContainer>
        <h2 className="text-2xl font-medium leading-tight">
          Who are we and how do we use the data we collect from you through this
          survey?
        </h2>
        <p>
          This research study is being conducted by the{' '}
          <a
            href={'https://media-bias-research.org/'}
            target="_blank"
            className="link"
            rel="noreferrer"
          >
            Media Bias Group
          </a>
          . We are a group of researchers from various disciplines with the goal
          to develop systems and data sets to uncover media bias or unbalanced
          coverage in articles.{' '}
        </p>
        <p>
          This study is anonymous. That means that we will not record any
          information about you that could identify you personally or be
          associated with you. On the basis of the collected data, we aim to
          publish scientific papers on presentations of articles that help to
          detect biased language, but these publications do not allow any
          inference to you as an individual. Once the study is published, the
          anonymised data might be made available on a public data repository.
          Your rights to access, change or move your information are limited
          insofar as the data may no longer be modified after the data has been
          published in anonymized form. The reason for this is that we need to
          manage your information in specific ways for the research to be
          reliable and accurate. Once anonymised, we will not be able to delete
          your data.
        </p>
        <p>
          Once the survey is complete, you will be redirected to Prolific.
          Participation in this study is voluntary. You may choose not to
          participate and you may withdraw at any time during the study without
          any penalty to you. If you have any questions about the study or study
          procedures, you may contact us under <MBGMail />.
        </p>
        <Form
          id="data-processing-consent-form"
          className="bg-base-200 mt-2 rounded-lg p-4 text-lg shadow"
          onSubmit={handleSubmit(async (data) =>
            setDataProcessingConsentMutation.mutateAsync(data)
          )}
        >
          <Form.Label title="I agree to the processing of my personal data in accordance with the information provided herein">
            <Toggle
              className="toggle-primary m-2"
              {...register('dataProcessingConsent')}
            />
          </Form.Label>
        </Form>
      </TextContainer>
    </StudyLayout>
  );
}
