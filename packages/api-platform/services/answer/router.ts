import { StudyProgress } from '@prisma/client-platform';
import { TRPCError } from '@trpc/server';

import { createRouter } from '../../lib/trpc/create-router';
import isParticipant from '../../middleware/participant.middleware';
import { answerSchema } from '../../schemas/answer.schema';

export const answerRouter = createRouter()
  .middleware(isParticipant)
  .mutation('create', {
    input: answerSchema,
    async resolve({ input, ctx }) {
      const { id } = ctx.participant;
      const answer = await ctx.prisma.answer.create({
        data: {
          participantId: id,
          ...input,
        },
      });

      // Transition progress
      await ctx.prisma.participantProgress.create({
        data: {
          participantId: id,
          progress: StudyProgress.INTRO_STUDY_04,
        },
      });

      if (!answer) {
        throw new TRPCError({
          message: 'Failed to save form data.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    },
  });
