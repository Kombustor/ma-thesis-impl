import React, { useState } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import { HiExclamationCircle, HiTrash } from 'react-icons/hi';

import {
  InferMutationInput,
  TError,
  TMutation,
  trpc,
} from '@mbg/api-platform/lib/trpc';

type Props<K extends TMutation> = {
  mutationName: K;
  input: InferMutationInput<K>;

  onDelete: () => void;
};

export default function DeleteButton<K extends TMutation>({
  mutationName,
  input,
  onDelete,
}: Props<K>) {
  const [clicked, setClicked] = useState(false);
  const mutation = trpc.useMutation(mutationName);

  const handleClick = async () => {
    if (!clicked) {
      return setClicked(true);
    }

    try {
      await mutation.mutateAsync(input);
      onDelete();
    } catch (error) {
      toast.error((error as TError).message);
    }
  };

  // onMouseLeave cancels the delete action
  return (
    <Button
      onClick={handleClick}
      onMouseLeave={() => setClicked(false)}
      loading={mutation.isLoading}
      color={clicked ? 'warning' : 'error'}
    >
      {!mutation.isLoading ? (
        clicked ? (
          <HiExclamationCircle />
        ) : (
          <HiTrash />
        )
      ) : (
        <></>
      )}
    </Button>
  );
}
