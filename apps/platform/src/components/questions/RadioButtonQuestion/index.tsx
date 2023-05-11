import { ButtonGroup } from 'react-daisyui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import ButtonWithLabel from '@/components/questions/RadioButtonQuestion/ButtonWithLabel';
import RadioQuestionsWrapper from '@/components/questions/RadioButtonQuestion/RadioQuestionWrapper';

type Props<T extends FieldValues> = {
  question: string;
  options: string[];
  fieldToRegister: keyof T;
  control: Control<T>;
};

export default function RadioButtonQuestion<T extends FieldValues>({
  question,
  options,
  fieldToRegister,
  control,
}: Props<T>) {
  return (
    <RadioQuestionsWrapper question={question}>
      <Controller<T>
        name={fieldToRegister as Path<T>}
        control={control}
        render={({ field: { onChange, ...props } }) => (
          <ButtonGroup vertical>
            {options.map((option) => (
              <ButtonWithLabel
                key={option}
                onChange={() => onChange(option)}
                option={option}
                {...props}
              />
            ))}
          </ButtonGroup>
        )}
      />
    </RadioQuestionsWrapper>
  );
}
