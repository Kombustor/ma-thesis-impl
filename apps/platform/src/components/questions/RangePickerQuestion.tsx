import React from 'react';
import { Range } from 'react-daisyui';
import { UseFormReturn } from 'react-hook-form';

import QuestionTitle from '@/components/questions/QuestionTitle';

import { RangeQuestion } from '@mbg/api-platform/lib/questions';
import { Answer } from '@mbg/api-platform/schemas/answer.schema';

type Props = RangeQuestion & {
  register: UseFormReturn<Answer>['register'];
  fieldToRegister: keyof Answer;
};

export default function RangePickerQuestion({
  question,
  minLabel,
  maxLabel,
  min,
  max,
  defaultValue,
  register,
  fieldToRegister,
}: Props) {
  return (
    <>
      <QuestionTitle question={question} />
      <div className="grid grid-cols-6 gap-2 p-5">
        <Range
          min={min}
          max={max}
          className="range-primary col-span-4 col-start-2"
          defaultValue={defaultValue}
          {...register(fieldToRegister, { valueAsNumber: true })}
        />
        <label className="col-start-1 col-end-3 text-center text-lg">
          {minLabel}
        </label>
        <label className="col-span-2 col-end-7 text-center text-lg">
          {maxLabel}
        </label>
      </div>
    </>
  );
}
