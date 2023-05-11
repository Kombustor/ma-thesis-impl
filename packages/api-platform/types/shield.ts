import { AnyRouter } from '@trpc/server';
import { ILogicRule, IRule } from 'trpc-shield/lib/types';

type QueryKeys<R extends AnyRouter> = keyof R['_def']['queries'];
type MutationKeys<R extends AnyRouter> = keyof R['_def']['mutations'];

export type Shield<R extends AnyRouter> = {
  query: {
    [key in QueryKeys<R>]: IRule | ILogicRule;
  };
  mutation: {
    [key in MutationKeys<R>]: IRule | ILogicRule;
  };
};
