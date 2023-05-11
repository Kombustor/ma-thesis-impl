import {
  createProtectedRouter,
  createRouter,
} from '../../lib/trpc/create-router';
import isParticipant from '../../middleware/participant.middleware';
import {
  ParticipantId,
  UpdateParticipantSchema,
  dataProcessingConsentSchema,
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
      return await ctx.prismaWrite.participant.findUnique({
        where: { id: input },
      });
    },
  })
  .mutation('update', {
    input: UpdateParticipantSchema,
    async resolve({ input, ctx }) {
      return await ctx.prismaWrite.participant.update({
        where: { id: input.id },
        data: input.data,
      });
    },
  })
  .mutation('delete', {
    input: ParticipantId,
    async resolve({ input, ctx }) {
      return await ctx.prismaWrite.participant.delete({ where: { id: input } });
    },
  });

export const publicParticipantRouter = createRouter()
  .middleware(isParticipant)
  .mutation('set-data-processing-consent', {
    input: dataProcessingConsentSchema,
    async resolve({ ctx, input }) {
      const { dataProcessingConsent } = input;
      const { id } = ctx.participant;

      dataProcessingConsent &&
        (await ctx.prismaWrite.participant.update({
          where: {
            id,
          },
          data: {
            dataProcessingConsent,
          },
        }));

      return dataProcessingConsent;
    },
  });
