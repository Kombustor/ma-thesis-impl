import React from 'react';
import { Button } from 'react-daisyui';
import { HiPencil, HiPlus } from 'react-icons/hi';

type Props = {
  edit?: boolean;
};

export default function ModifyButton({
  edit,
  ...props
}: Props & React.ComponentProps<typeof Button>) {
  return (
    <Button {...props} color={edit ? 'warning' : 'success'}>
      {edit ? <HiPencil /> : <HiPlus />}
    </Button>
  );
}
