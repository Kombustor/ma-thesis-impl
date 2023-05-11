import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { Form } from 'react-daisyui';
import toast from 'react-hot-toast';

import { useZodForm } from '@/components/hooks/useZodForm';
import StudyNextButton from '@/components/layout/StudyNextButton';
import NewsOutletPicker from '@/components/questions/NewsOutletPicker';
import NumberQuestion from '@/components/questions/NumberQuestion';
import RadioButtonQuestion from '@/components/questions/RadioButtonQuestion';
import RangePickerQuestion from '@/components/questions/RangePickerQuestion';
import StudyLayout from '@/layouts/StudyLayout';
import { requireProgress } from '@/lib/progress';

import { QUESTIONS, QuestionType } from '@mbg/api-platform/lib/questions';
import { TError, trpc } from '@mbg/api-platform/lib/trpc';
import { StudyProgress } from '@mbg/api-platform/models/enums';
import { Answer, answerSchema } from '@mbg/api-platform/schemas/answer.schema';

export const getServerSideProps: GetServerSideProps = requireProgress(
  StudyProgress.QUESTIONS_03
)();

export default function QuestionsPage() {
  const router = useRouter();
  const [questionIdx, setQuestionIdx] = useState(0);
  const {
    register,
    handleSubmit,
    control,
    formState: { dirtyFields, isSubmitting, errors },
  } = useZodForm({
    schema: answerSchema,
    mode: 'onChange',
  });
  const answerNotSelected = !(Object.values(dirtyFields)[questionIdx] || false);
  const answerCreateMutation = trpc.useMutation('answer.create', {
    onSuccess: () => {
      router.push('/04-introduction-study');
    },
    onError: (error) => {
      toast.error((error as TError).message);
      setTimeout(() => {
        router.reload();
      }, 2500);
    },
  });

  const questions = useMemo(
    () =>
      Object.keys(QUESTIONS).map((key) => {
        const question = QUESTIONS[key];
        switch (question.type) {
          case QuestionType.SINGLE_CHOICE:
            return (
              <RadioButtonQuestion<Answer>
                fieldToRegister={key as keyof Answer}
                control={control}
                {...question}
              />
            );
          // Technically this is semantically not 100% correct but I guess it's fine
          case QuestionType.MULTIPLE_CHOICE:
            return <NewsOutletPicker control={control} {...question} />;
          case QuestionType.RANGE:
            return (
              <RangePickerQuestion
                fieldToRegister={key as keyof Answer}
                register={register}
                {...question}
              />
            );
          case QuestionType.NUMBER:
            return (
              <NumberQuestion
                fieldToRegister={key as keyof Answer}
                register={register}
                {...question}
              />
            );
        }
      }),
    [control, register]
  );

  const lastQuestion = questionIdx === questions.length - 1;
  return (
    <StudyLayout
      progress={StudyProgress.QUESTIONS_03}
      nextButton={
        lastQuestion ? (
          <StudyNextButton
            type="submit"
            form="questions"
            disabled={
              answerNotSelected ||
              isSubmitting ||
              Object.keys(errors).length > 0
            }
            loading={isSubmitting}
          />
        ) : (
          <StudyNextButton
            onClick={() => {
              setQuestionIdx(questionIdx + 1);
            }}
            disabled={
              answerNotSelected ||
              !!errors[
                Object.keys(QUESTIONS)[questionIdx] as keyof typeof errors
              ]
            }
          />
        )
      }
    >
      <Form
        id="questions"
        className="flex gap-4 p-10"
        onSubmit={handleSubmit(async (data) =>
          answerCreateMutation.mutateAsync(data)
        )}
      >
        {questions[questionIdx]}
      </Form>
    </StudyLayout>
  );
}
