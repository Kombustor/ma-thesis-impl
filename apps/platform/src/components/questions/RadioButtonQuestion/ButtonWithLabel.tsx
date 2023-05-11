import React from 'react';
import { Radio } from 'react-daisyui';
import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

type Props = { option: string };

function ButtonWithLabel<T extends FieldValues>(
  { option, onChange, ...props }: Props & ControllerRenderProps<T, Path<T>>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <label
      key={option}
      className="label flex flex-row-reverse items-center justify-end gap-4 py-1 "
    >
      <span className="label-text cursor-pointer text-lg">{option}</span>
      <Radio
        className="checked:bg-primary"
        {...props}
        ref={ref}
        onChange={onChange}
      />
    </label>
  );
}

export default React.forwardRef(ButtonWithLabel);
