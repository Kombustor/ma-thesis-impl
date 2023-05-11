import type { Participant } from '@prisma/client-platform';
import { TRPCError } from '@trpc/server';
import { MiddlewareFunction } from '@trpc/server/dist/declarations/src/internals/middlewares';

import { Context } from '../lib/trpc/create-context';

export type ParticipantContext = Omit<Context, 'user' | 'session'> & {
  participant: Participant;
};

const isParticipant: MiddlewareFunction<
  Context,
  ParticipantContext,
  unknown
> = async ({ ctx, next }) => {
  // Get existing cookie
  const existingCookie = ctx.req.cookies['participantSession'];
  if (!existingCookie) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  // Validate participant id
  const participant = await ctx.prisma.participant.findUnique({
    where: {
      id: existingCookie,
    },
  });

  if (!participant) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      participant,
    },
  });
};

export default isParticipant;
