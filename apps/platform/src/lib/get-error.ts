import { TError } from '@mbg/api-platform/lib/trpc';

export function getErrorMessage(error: TError) {
  return (
    error.message ||
    error.shape?.message ||
    error.data?.code ||
    'An unknown error occured! Please try again.'
  );
}
