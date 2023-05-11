import React from 'react';
import { Button } from 'react-daisyui';

type Props = {
  text: string;
};

export default function SubmitButton({
  text,
  ...props
}: Props & React.ComponentProps<typeof Button>) {
  return (
    <Button className="mx-auto mt-4 w-1/2" type="submit" {...props}>
      {text}
    </Button>
  );
}
