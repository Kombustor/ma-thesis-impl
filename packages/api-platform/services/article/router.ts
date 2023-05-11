import { TRPCError } from '@trpc/server';

import { rawHtmlToContent } from '../../lib/inference-client';
import {
  createProtectedRouter,
  createRouter,
} from '../../lib/trpc/create-router';
import isParticipant from '../../middleware/participant.middleware';
import {
  ArticleId,
  ArticleRawToParsedInputSchema,
  CreateArticleSchema,
  UpdateArticleSchema,
} from '../../schemas/article.schema';

export const adminArticleRouter = createProtectedRouter()
  // =============== CRUD ===============
  .query('find-many', {
    async resolve({ ctx }) {
      return await ctx.prisma.article.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    },
  })
  .query('find', {
    input: ArticleId,
    async resolve({ input, ctx }) {
      return await ctx.prisma.article.findUnique({
        where: { id: input },
      });
    },
  })
  .mutation('create', {
    input: CreateArticleSchema,
    async resolve({ input, ctx }) {
      return await ctx.prisma.article.create({ data: input.data });
    },
  })
  .mutation('update', {
    input: UpdateArticleSchema,
    async resolve({ input, ctx }) {
      return await ctx.prisma.article.update({
        where: { id: input.id },
        data: input.data,
      });
    },
  })
  .mutation('delete', {
    input: ArticleId,
    async resolve({ input, ctx }) {
      return await ctx.prisma.article.delete({ where: { id: input } });
    },
  })
  // =============== CUSTOM ==============
  .query('find-with-content', {
    input: ArticleId,
    async resolve({ ctx, input }) {
      const article = await ctx.prisma.article.findUnique({
        where: {
          id: input,
        },
        include: {
          contents: {
            orderBy: {
              indexInArticle: 'asc',
            },
          },
        },
      });

      if (!article) {
        console.error(`Article with id=${input} not found.`);
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Could not find article.',
        });
      }

      return article;
    },
  })
  .mutation('raw-to-parsed', {
    input: ArticleRawToParsedInputSchema,
    async resolve({ ctx, input }) {
      const article = await ctx.prisma.article.findFirst({
        where: {
          source: input.link,
        },
        select: {
          id: true,
        },
      });

      if (article) {
        return article.id;
      }

      const parsedArticle = await rawHtmlToContent(input.rawHtml);

      if (!parsedArticle) {
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'Could not parse article content.',
        });
      }

      if (parsedArticle.source !== input.link) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Parsed article does not correspond to the provided link.',
        });
      }

      const newArticle = await ctx.prisma.article.create({
        data: {
          ...parsedArticle,
          contents: {
            createMany: { data: parsedArticle.contents },
          },
        },
        select: {
          id: true,
        },
      });

      if (!newArticle) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not create new article.',
        });
      }
      return newArticle.id;
    },
  });

export const articleRouter = createRouter()
  .middleware(isParticipant)
  .query('get-articles', {
    async resolve({ ctx }) {
      return await ctx.prisma.article.findMany({
        where: {
          indexInStudy: {
            gte: 0,
          },
        },
        orderBy: {
          indexInStudy: 'asc',
        },
        include: {
          contents: {
            orderBy: {
              indexInArticle: 'asc',
            },
          },
        },
      });
    },
  });
