import { TRPCError } from '@trpc/server';
import { MiddlewareFunction } from '@trpc/server/dist/declarations/src/internals/middlewares';

import { Context } from '../lib/trpc/create-context';

export type AuthenticatedContext = Omit<Context, 'user' | 'session'> & {
  user: NonNullable<Context['user']>;
  session: NonNullable<Context['session']>;
};

const isAuthenticated: MiddlewareFunction<
  Context,
  AuthenticatedContext,
  unknown
> = ({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      // infers that `user` and `session` are non-nullable to downstream procedures
      session: ctx.session,
      user: ctx.user,
    },
  });
};

export default isAuthenticated;
