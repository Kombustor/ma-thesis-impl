import { FeedbackMechanism, StudyProgress } from '@prisma/client-platform';

import { attentionCheck } from '../../lib/attention-check';
import {
  createProtectedRouter,
  createRouter,
} from '../../lib/trpc/create-router';
import isParticipant from '../../middleware/participant.middleware';
import {
  AttentionCheckResult,
  attentionCheckAnswerSchema,
  maxAttempts,
} from '../../schemas/attention-check.schema';
import {
  ParticipantId,
  UpdateParticipantSchema,
  dataProcessingConsentSchema,
  dataUsableForResearchSchema,
} from '../../schemas/participant.schema';

export const adminParticipantRouter = createProtectedRouter()
  .query('find-many', {
    async resolve({ ctx }) {
      return await ctx.prisma.participant.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    },
  })
  .query('find', {
    input: ParticipantId,
    async resolve({ input, ctx }) {
      return await ctx.prisma.participant.findUnique({
        where: { id: input },
      });
    },
  })
  .mutation('update', {
    input: UpdateParticipantSchema,
    async resolve({ input, ctx }) {
      return await ctx.prisma.participant.update({
        where: { id: input.id },
        data: input.data,
      });
    },
  })
  .mutation('delete', {
    input: ParticipantId,
    async resolve({ input, ctx }) {
      return await ctx.prisma.participant.delete({ where: { id: input } });
    },
  });

export const publicParticipantRouter = createRouter()
  .middleware(isParticipant)
  .mutation('attention-check', {
    input: attentionCheckAnswerSchema,
    async resolve({ input, ctx }) {
      const { participant, prisma } = ctx;

      // If attention check not passed
      if (
        attentionCheck.options.indexOf(input.answer) !==
        attentionCheck.correctIdx
      ) {
        const updatedParticipant = await prisma.participant.update({
          where: {
            id: participant.id,
          },
          data: {
            attentionCheckFailures: participant.attentionCheckFailures + 1,
            // Move back to previous progress
            progress: {
              deleteMany: {
                participantId: participant.id,
                progress: StudyProgress.ATTENTION_CHECK_06,
              },
            },
          },
        });

        return updatedParticipant.attentionCheckFailures > maxAttempts - 1
          ? AttentionCheckResult.FINAL_FAILURE
          : AttentionCheckResult.FAILED_ATTEMPT;
      }

      // Attention check passed

      // Feedback mechanism might already be set
      let newFeedbackMechanism: FeedbackMechanism | null =
        participant.feedbackMechanism;

      // if not, choose least used mechanism
      if (!newFeedbackMechanism) {
        const feedbackMechanismCounts = await prisma.participant.groupBy({
          by: ['feedbackMechanism'],
          where: {
            // eslint-disable-next-line unicorn/no-null
            feedbackMechanism: { not: null },
          },
          _count: {
            feedbackMechanism: true,
          },
          orderBy: {
            _count: {
              feedbackMechanism: 'asc',
            },
          },
        });

        const enumKeys = Object.values(FeedbackMechanism)
          .filter((element) => !Number.isNaN(element))
          .sort((one, two) => (one > two ? 1 : -1));
        newFeedbackMechanism =
          feedbackMechanismCounts.length < enumKeys.length
            ? FeedbackMechanism[enumKeys[feedbackMechanismCounts.length]]
            : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              feedbackMechanismCounts[0].feedbackMechanism!;
      }

      // Update participant
      await prisma.participant.update({
        where: { id: participant.id },
        data: {
          feedbackMechanism: newFeedbackMechanism,
          // Transition to next progress
          progress: {
            create: {
              progress: StudyProgress.INTRO_TASK_07,
            },
          },
        },
      });

      return AttentionCheckResult.SUCCESS;
    },
  })
  .mutation('set-data-usable-for-research', {
    input: dataUsableForResearchSchema,
    async resolve({ ctx, input }) {
      const { id } = ctx.participant;
      const { dataUsableForResearch } = input;

      dataUsableForResearch &&
        (await ctx.prisma.participant.update({
          where: {
            id,
          },
          data: {
            dataUsableForResearch,
          },
        }));

      // Transition to next progress
      await ctx.prisma.participantProgress.create({
        data: {
          participantId: id,
          progress: StudyProgress.END_10,
        },
      });

      return dataUsableForResearch;
    },
  })
  .mutation('set-data-processing-consent', {
    input: dataProcessingConsentSchema,
    async resolve({ ctx, input }) {
      const { dataProcessingConsent } = input;
      const { id } = ctx.participant;

      dataProcessingConsent &&
        (await ctx.prisma.participant.update({
          where: {
            id,
          },
          data: {
            dataProcessingConsent,
            // Transition to next progress
            progress: {
              create: {
                progress: StudyProgress.QUESTIONS_03,
              },
            },
          },
        }));

      return dataProcessingConsent;
    },
  });
