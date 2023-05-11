import { TRPCError } from '@trpc/server';

import { createRouter } from '../../lib/trpc/create-router';
import isParticipant from '../../middleware/participant.middleware';
import { CreateFeedbackSchema } from '../../schemas/feedback.schema';

export const feedbackRouter = createRouter()
  .middleware(isParticipant)
  .mutation('create', {
    input: CreateFeedbackSchema,
    async resolve({ input, ctx }) {
      const { prismaWrite, participant } = ctx;

      const feedback = await prismaWrite.feedback.upsert({
        where: {
          participantId_contentId: {
            participantId: participant.id,
            contentId: input.contentId,
          },
        },
        create: {
          ...input,
          participantId: participant.id,
        },
        update: {
          ...input,
        },
      });

      if (!feedback) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not create or update feedback.',
        });
      }
    },
  });
