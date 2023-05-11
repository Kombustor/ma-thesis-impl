import type { UseTRPCQueryOptions } from '@trpc/react';
import type { inferHandlerInput } from '@trpc/server';
import React from 'react';
import { UseQueryResult } from 'react-query';

import { ErrorMessage } from '@/components/misc/ErrorMessage';

import {
  InferQueryOutput,
  TError,
  TQueries,
  TQuery,
  inferProcedures,
  trpc,
} from '@mbg/api-platform/lib/trpc';
import { LoadingIndicator } from '@mbg/ui';

// Inspired by RedwoodJS cells.

type Props<K extends TQuery> = {
  // The query to execute
  query: [path: K, ...args: inferHandlerInput<TQueries[K]>];
  // Additional options to pass to the query
  opts?: UseTRPCQueryOptions<
    K,
    inferProcedures<TQueries>[K]['input'],
    inferProcedures<TQueries>[K]['output'],
    inferProcedures<TQueries>[K]['output'],
    TError
  >;
  // The component to render when the query is loading
  Loading?: React.FC;
  // The component to render when there's no data (null/[])
  Empty?: React.FC;
  // The component to render when an error occured
  Failure?: React.FC<ErrorProps<K>>;
  // The component to render when the data is loaded
  Success: React.FC<SuccessProps<K>>;
};

type ErrorProps<K extends TQuery> = Pick<
  UseQueryResult<K>,
  'error' | 'errorUpdateCount' | 'errorUpdatedAt'
>;

type SuccessProps<K extends TQuery> = { data: InferQueryOutput<K> } & Pick<
  UseQueryResult,
  'dataUpdatedAt' | 'refetch' | 'remove'
>;

export function Cell<K extends TQuery>({
  query,
  opts,
  Loading,
  Empty,
  Failure,
  Success,
}: Props<K>): React.ReactElement | null {
  const cellQuery = trpc.useQuery(query, {
    retry: (count, error) => {
      // Retry 3 times if it's a server error
      return (error.data?.httpStatus ?? 0) >= 500 &&
        (error.data?.httpStatus ?? 0 < 600)
        ? count < 3
        : false;
    },
    ...opts,
  });

  // Failure
  if (cellQuery.isError) {
    if (Failure) {
      return <Failure {...cellQuery} />;
    }

    // If Failure is not provided, we render a default error component
    return <ErrorMessage error={cellQuery.error} />;
  }

  // Loading
  if (cellQuery.isLoading || !cellQuery.data) {
    if (Loading) {
      return <Loading />;
    }

    // Default loading indicator
    return <LoadingIndicator />;
  }

  // Empty
  // If Empty is not provided, empty results are sent to success
  if (
    Empty &&
    (cellQuery.data === null ||
      (Array.isArray(cellQuery.data) && cellQuery.data.length === 0))
  ) {
    return <Empty />;
  }

  // Success
  return <Success {...cellQuery} data={cellQuery.data} />;
}
