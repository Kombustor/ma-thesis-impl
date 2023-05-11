import { Alert } from 'react-daisyui';

import { getErrorMessage } from '@/lib/get-error';

import { TError } from '@mbg/api-platform/lib/trpc';

type Props = {
  error: TError;
};

export function ErrorMessage({ error }: Props) {
  return (
    <Alert className="font-semibold" status="error">
      Error: {getErrorMessage(error)}
    </Alert>
  );
}
