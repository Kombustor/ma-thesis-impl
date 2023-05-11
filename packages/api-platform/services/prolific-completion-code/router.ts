import { createProtectedRouter } from '../../lib/trpc/create-router';
import {
  CreateProlificCompletionCodeSchema,
  ProlificCompletionCodeId,
  UpdateProlificCompletionCodeSchema,
} from '../../schemas/prolific-completion-code.schema';

export const prolificCompletionCodeRouter = createProtectedRouter()
  .query('find-many', {
    async resolve({ ctx }) {
      return await ctx.prisma.prolificCompletionCode.findMany();
    },
  })
  .query('find', {
    input: ProlificCompletionCodeId,
    async resolve({ input, ctx }) {
      return await ctx.prisma.prolificCompletionCode.findUnique({
        where: { id: input },
      });
    },
  })
  .mutation('create', {
    input: CreateProlificCompletionCodeSchema,
    async resolve({ input, ctx }) {
      return await ctx.prisma.prolificCompletionCode.create({
        data: input.data,
      });
    },
  })
  .mutation('update', {
    input: UpdateProlificCompletionCodeSchema,
    async resolve({ input, ctx }) {
      return await ctx.prisma.prolificCompletionCode.update({
        where: { id: input.id },
        data: input.data,
      });
    },
  })
  .mutation('delete', {
    input: ProlificCompletionCodeId,
    async resolve({ input, ctx }) {
      return await ctx.prisma.prolificCompletionCode.delete({
        where: { id: input },
      });
    },
  });
