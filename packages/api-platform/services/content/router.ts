import { TRPCError } from '@trpc/server';

import { analyze } from '../../lib/inference-client';
import { createProtectedRouter } from '../../lib/trpc/create-router';
import { ArticleId } from '../../schemas/article.schema';
import { AddGroundTruthInput, ContentId } from '../../schemas/content.schema';

export const contentRouter = createProtectedRouter()
  .mutation('delete-contents', {
    input: ContentId.array(),
    async resolve({ ctx, input }) {
      await ctx.prismaWrite.content.deleteMany({
        where: {
          id: {
            in: input,
          },
        },
      });
    },
  })
  .mutation('add-ground-truth', {
    input: AddGroundTruthInput,
    async resolve({ ctx, input }) {
      const { ids, groundTruthBiased } = input;
      await ctx.prismaWrite.$transaction(
        ids.map((id) =>
          ctx.prismaWrite.content.updateMany({
            where: {
              id,
            },
            data: {
              groundTruthBiased,
            },
          })
        )
      );
    },
  })
  .mutation('analyze', {
    input: ArticleId,
    async resolve({ ctx, input }) {
      const { prisma, prismaWrite } = ctx;
      const article = await prisma.article.findFirst({
        where: {
          id: input,
        },
        select: {
          inferenceAvailable: true,
          contents: {
            select: {
              id: true,
              text: true,
            },
          },
        },
      });
      if (!article) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Article does not exist',
        });
      }

      // Article was already analyzed
      if (article.inferenceAvailable) return;

      const analyzedContent = await analyze(article.contents);

      if (!analyzedContent) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not analyze article content',
        });
      }

      const updatedContent = await prismaWrite.$transaction(
        analyzedContent.map(({ biased, id }) =>
          prismaWrite.content.updateMany({
            where: {
              id,
            },
            data: {
              biased,
            },
          })
        )
      );

      if (!updatedContent) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not update content.',
        });
      }

      const updatedArticle = await prismaWrite.article.update({
        where: {
          id: input,
        },
        data: {
          inferenceAvailable: true,
          biasPercentage:
            analyzedContent.reduce(
              (acc, { biased }) => acc + (biased ? 1 : 0),
              0
            ) / analyzedContent.length,
        },
      });

      if (!updatedArticle) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not update article.',
        });
      }
    },
  });
