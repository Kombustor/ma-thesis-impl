/* eslint-disable unicorn/filename-case */
import { TRPCClientErrorLike, createReactQueryHooks } from '@trpc/react';
// ℹ️ Type-only import:
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export
import type {
  ProcedureRecord,
  inferProcedureInput,
  inferProcedureOutput,
} from '@trpc/server';

import type { AppRouter } from '../../services';

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
export const trpc = createReactQueryHooks<AppRouter>();

export type TQueries = AppRouter['_def']['queries'];
export type TMutations = AppRouter['_def']['mutations'];

/**
 * Enum containing all api query paths
 */
export type TQuery = keyof TQueries;
/**
 * Enum containing all api mutation paths
 */
export type TMutation = keyof TMutations;

export type inferProcedures<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TObj extends ProcedureRecord<any, any, any, any, any, any>
> = {
  [TPath in keyof TObj]: {
    input: inferProcedureInput<TObj[TPath]>;
    output: inferProcedureOutput<TObj[TPath]>;
  };
};

export type TError = TRPCClientErrorLike<AppRouter>;

/**
 * This is a helper method to infer the output of a query resolver.
 * It is used by our custom cells to support declarative data fetching
 * @example type HelloOutput = InferQueryOutput<'hello'>
 */
export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  AppRouter['_def']['queries'][TRouteKey]
>;

/**
 * This is a helper method to infer the input of a query resolver
 * @example type HelloInput = InferQueryInput<'hello'>
 */
export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
  AppRouter['_def']['queries'][TRouteKey]
>;

/**
 * This is a helper method to infer the output of a mutation resolver
 * @example type HelloOutput = InferMutationOutput<'hello'>
 */
export type InferMutationOutput<TRouteKey extends TMutation> =
  inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>;

/**
 * This is a helper method to infer the input of a mutation resolver
 * @example type HelloInput = InferMutationInput<'hello'>
 */
export type InferMutationInput<TRouteKey extends TMutation> =
  inferProcedureInput<AppRouter['_def']['mutations'][TRouteKey]>;

export { default as transformer } from 'superjson';
export { type AppRouter } from '../../services';
