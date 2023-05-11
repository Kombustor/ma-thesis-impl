import { ForwardedRef, forwardRef } from 'react';
import { Textarea, TextareaProps } from 'react-daisyui';

import { classNames } from '@mbg/ui';

function ReasonInput(
  props: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) {
  return (
    <Textarea
      {...props}
      ref={ref}
      maxLength={100}
      placeholder="Provide a reason (optional)"
      className={classNames('w-full mt-4 btn-outline', props.className)}
    />
  );
}

export default forwardRef(ReasonInput);
