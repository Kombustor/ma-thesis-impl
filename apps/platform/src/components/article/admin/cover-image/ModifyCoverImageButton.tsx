import React from 'react';
import { Button } from 'react-daisyui';
import { HiPhotograph } from 'react-icons/hi';

export default function ModifyCoverImageButton(
  props: React.ComponentProps<typeof Button>
) {
  return (
    <Button {...props} color="accent">
      <HiPhotograph />
    </Button>
  );
}
