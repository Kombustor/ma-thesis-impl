import { Input } from 'react-daisyui';
import { UseFormReturn } from 'react-hook-form';

import QuestionTitle from '@/components/questions/QuestionTitle';

import { NumberQuestion as NumberQuestionType } from '@mbg/api-platform/lib/questions';
import { Answer } from '@mbg/api-platform/schemas/answer.schema';

type Props = NumberQuestionType & {
  register: UseFormReturn<Answer>['register'];
  fieldToRegister: keyof Answer;
};

export default function NumberQuestion({
  question,
  min,
  max,
  register,
  fieldToRegister,
}: Props) {
  return (
    <>
      <QuestionTitle question={question} />
      <Input
        type="number"
        className="w-1/2"
        min={min}
        max={max}
        placeholder={String(min)}
        {...register(fieldToRegister, { valueAsNumber: true })}
      />
    </>
  );
}
