import { StudyProgress } from '@prisma/client-platform';
import { TRPCError } from '@trpc/server';

import { createRouter } from '../../lib/trpc/create-router';
import isParticipant from '../../middleware/participant.middleware';
import { CreateManyFeedbackSchema } from '../../schemas/feedback.schema';

export const feedbackRouter = createRouter()
  .middleware(isParticipant)
  .mutation('create-many', {
    input: CreateManyFeedbackSchema,
    async resolve({ input, ctx }) {
      const { prisma, participant } = ctx;
      const feedback = await prisma.feedback.createMany({
        data: input.map((i) => ({
          ...i,
          participantId: participant.id,
        })),
      });

      if (!feedback) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not create feedback.',
        });
      }

      const totalNumArticles = await prisma.article.count({
        where: {
          indexInStudy: {
            gte: 0,
          },
        },
      });

      const newArticleProgress = participant.articleProgress + 1;
      // If the participant has read all articles, transition to the next study step
      // Otherwise, update the article progress
      const newData =
        newArticleProgress === totalNumArticles
          ? {
              articleProgress: totalNumArticles,
              progress: {
                create: {
                  progress: StudyProgress.TRUST_CHECK_09,
                },
              },
            }
          : {
              articleProgress: newArticleProgress,
            };

      // Update progress
      await prisma.participant.update({
        where: {
          id: participant.id,
        },
        data: newData,
      });
    },
  });
