import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Form } from 'react-daisyui';
import toast from 'react-hot-toast';

import { useZodForm } from '@/components/hooks/useZodForm';
import StudyNextButton from '@/components/layout/StudyNextButton';
import RadioButtonQuestion from '@/components/questions/RadioButtonQuestion';
import StudyLayout from '@/layouts/StudyLayout';
import getProlificCompletionUrl from '@/lib/get-prolific-completion-url';
import { ensureAndTransitionCurrentProgress } from '@/lib/progress';
import warningToast from '@/lib/warning-toast';
import withParticipantAuthenticated from '@/lib/with-participant-authenticated';

import { attentionCheck } from '@mbg/api-platform/lib/attention-check';
import { TError, trpc } from '@mbg/api-platform/lib/trpc';
import {
  ProlificCompletionCodeEvent,
  StudyProgress,
} from '@mbg/api-platform/models/enums';
import {
  AttentionCheckAnswer,
  AttentionCheckResult,
  attentionCheckAnswerSchema,
  maxAttempts,
} from '@mbg/api-platform/schemas/attention-check.schema';

const redirectSuccessPath = '/07-introduction-task';

export const getServerSideProps: GetServerSideProps =
  withParticipantAuthenticated(({ participant }) => async () => {
    const ssp = await ensureAndTransitionCurrentProgress({
      currentProgress: participant.studyProgress as StudyProgress,
      requiredProgress: StudyProgress.ATTENTION_CHECK_06,
      allowTransitionFrom: StudyProgress.INTRO_BIAS_05,
      participantId: participant.id,
    });
    if (ssp) {
      return ssp;
    }

    return getProlificCompletionUrl(
      ProlificCompletionCodeEvent.ATTENTION_CHECK_FAILED,
      {
        attentionCheckFailures: participant.attentionCheckFailures,
      }
    );
  });

export default function AttentionCheckPage({
  attentionCheckFailures,
  prolificUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { isSubmitted, isSubmitting, isDirty },
  } = useZodForm({
    schema: attentionCheckAnswerSchema,
  });
  const [lastAttemptToastShown, setLastAttemptToastShown] = useState(false);

  useEffect(() => {
    if (attentionCheckFailures === maxAttempts - 1 && !lastAttemptToastShown) {
      warningToast('This is your last attempt.');
      setLastAttemptToastShown(true);
    }
  }, [attentionCheckFailures, lastAttemptToastShown]);

  const attentionCheckMutation = trpc.useMutation(
    'public-participant.attention-check',
    {
      onSuccess: (data) => {
        if (data === AttentionCheckResult.SUCCESS) {
          toast.success('Quiz passed, redirecting to study.');
          setTimeout(() => router.push(redirectSuccessPath), 1000);
        } else if (data === AttentionCheckResult.FAILED_ATTEMPT) {
          warningToast(
            'Quiz failed. You have one more try. Redirecting to previous page.'
          );
          setTimeout(() => router.push('/05-introduction-media-bias'), 1000);
        } else {
          toast.error('Quiz failed. You will be redirected to Prolific.');
          if (prolificUrl) {
            setTimeout(() => router.push(prolificUrl), 1000);
            // Within a test session, redirect to first article even in failure case
          } else {
            setTimeout(() => router.push(redirectSuccessPath), 1000);
          }
        }
      },
      onError: (error) => {
        toast.error((error as TError).message);
      },
    }
  );
  return (
    <StudyLayout
      progress={StudyProgress.ATTENTION_CHECK_06}
      nextButton={
        <StudyNextButton
          type="submit"
          form="attention-check-form"
          disabled={isSubmitted || isSubmitting || !isDirty}
        />
      }
    >
      <Form
        id="attention-check-form"
        className="flex gap-4 p-10"
        onSubmit={handleSubmit((data) => {
          attentionCheckMutation.mutate(data);
        })}
      >
        <RadioButtonQuestion<AttentionCheckAnswer>
          question={attentionCheck.question}
          options={attentionCheck.options}
          fieldToRegister={'answer'}
          control={control}
        />
      </Form>
    </StudyLayout>
  );
}
