import { createProtectedRouter } from '../../lib/trpc/create-router';
import {
  CreateEmailWhitelistSchema,
  EmailWhitelistId,
  UpdateEmailWhitelistSchema,
} from '../../schemas/whitelist.schema';

export const whitelistRouter = createProtectedRouter()
  .query('find-many', {
    async resolve({ ctx }) {
      return await ctx.prisma.emailWhitelist.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    },
  })
  .query('find', {
    input: EmailWhitelistId,
    async resolve({ input, ctx }) {
      return await ctx.prisma.emailWhitelist.findUnique({
        where: { id: input },
      });
    },
  })
  .mutation('create', {
    input: CreateEmailWhitelistSchema,
    async resolve({ input, ctx }) {
      return await ctx.prismaWrite.emailWhitelist.create({ data: input.data });
    },
  })
  .mutation('update', {
    input: UpdateEmailWhitelistSchema,
    async resolve({ input, ctx }) {
      return await ctx.prismaWrite.emailWhitelist.update({
        where: { id: input.id },
        data: input.data,
      });
    },
  })
  .mutation('delete', {
    input: EmailWhitelistId,
    async resolve({ input, ctx }) {
      return await ctx.prismaWrite.emailWhitelist.delete({
        where: { id: input },
      });
    },
  });
