import { TRPCError } from '@trpc/server';
import { getPlaiceholder } from 'plaiceholder';

import { rawHtmlToContent } from '../../lib/inference-client';
import { getQualityStandards } from '../../lib/quality-standards';
import {
  createProtectedRouter,
  createRouter,
} from '../../lib/trpc/create-router';
import isParticipant from '../../middleware/participant.middleware';
import { ArticleModel } from '../../models';
import { HtmlType } from '../../models/enums';
import {
  ArticleId,
  ArticleRawToParsedInputSchema,
  MarkedSentenceReason,
  UpdateArticleSchema,
  UpdateCoverImageSchema,
} from '../../schemas/article.schema';
import { SETUP_CONFIG } from '../../setupconfig';

const SELECT_VIEW = {
  id: true,
  title: true,
  sitename: true,
  date: true,
};

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
  .mutation('update', {
    input: UpdateArticleSchema,
    async resolve({ input, ctx }) {
      return await ctx.prismaWrite.article.update({
        where: { id: input.id },
        data: input.data,
      });
    },
  })
  .mutation('delete', {
    input: ArticleId,
    async resolve({ input, ctx }) {
      return await ctx.prismaWrite.article.delete({ where: { id: input } });
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
        parsedArticle.source = input.link;
      }

      const newArticle = await ctx.prismaWrite.article.create({
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
  })
  .query('get-cover-image', {
    input: ArticleId,
    async resolve({ ctx, input }) {
      const article = await ctx.prisma.article.findUnique({
        where: {
          id: input,
        },
        select: {
          title: true,
          coverImage: true,
        },
      });

      if (!article) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Could not find article.',
        });
      }

      return {
        ...article,
        coverImage:
          article.coverImage || SETUP_CONFIG.articles.placeholderCoverImage,
      };
    },
  })
  .mutation('update-cover-image', {
    input: UpdateCoverImageSchema,
    async resolve({ ctx, input }) {
      const { base64, img } = await getPlaiceholder(input.imageUrl);

      const coverImage = {
        ...img,
        blurDataURL: base64,
      };

      return await ctx.prismaWrite.article.update({
        where: {
          id: input.id,
        },
        data: {
          coverImage: {
            upsert: {
              create: coverImage,
              update: coverImage,
            },
          },
        },
      });
    },
  });

export const articleRouter = createRouter()
  .middleware(isParticipant)
  .query('get-articles', {
    async resolve({ ctx }) {
      const articles = await ctx.prisma.article.findMany({
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          ...SELECT_VIEW,
          coverImage: true,
        },
      });

      return articles.map((article) => ({
        ...article,
        coverImage:
          article.coverImage || SETUP_CONFIG.articles.placeholderCoverImage,
      }));
    },
  })
  .query('get-article', {
    input: ArticleModel.shape.id.unwrap(),
    async resolve({ ctx, input }) {
      const article = await ctx.prisma.article.findUnique({
        where: {
          id: input,
        },
        select: {
          ...SELECT_VIEW,
          author: true,
          source: true,
          biasPercentage: true,
          credibleSource: true,
          omitsOpinion: true,
          contents: {
            include: {
              Feedback: {
                where: {
                  participantId: ctx.participant.id,
                },
                select: {
                  biased: true,
                  reason: true,
                },
              },
            },
            orderBy: {
              indexInArticle: 'asc',
            },
          },
        },
      });

      if (!article) {
        return;
      }

      /*
        Selects X random Content ids with the following rules:
        - If a sentence has received some feedback but not enough for the majority vote
        - If a sentence has received enough feedback and is controverse
      */
      const markedSentences: {
        id: string;
        status: MarkedSentenceReason;
      }[] = await ctx.prisma.$queryRaw`
        SELECT * FROM (
          SELECT RandomContent.id,
          CASE
            WHEN feedbackCount > 0 AND feedbackCount < ${
              SETUP_CONFIG.articles.majorityVoteTreshold
            } THEN 'NOT_ENOUGH_FEEDBACK'
            WHEN feedbackCount >= ${
              SETUP_CONFIG.articles.majorityVoteTreshold
            } AND "avgBiased" BETWEEN ${
        SETUP_CONFIG.articles.controverseBias.lowerBound
      } AND ${
        SETUP_CONFIG.articles.controverseBias.upperBound
      } THEN 'CONTROVERSE_FEEDBACK'
            ELSE 'OTHER'
          END AS status
          FROM (
            SELECT id
            FROM "Content"
            WHERE "articleId" = ${article.id} AND "htmlType" = ${HtmlType.SPAN}
            ORDER BY RANDOM()
          ) AS RandomContent
          JOIN (
            SELECT "contentId", COUNT(*) AS feedbackCount, AVG(biased::int) AS "avgBiased"
            FROM "Feedback"
            GROUP BY "contentId"
          ) AS ContentFeedback ON ContentFeedback."contentId" = RandomContent.id
        ) as RandomContentWithFeedback
        WHERE status != 'OTHER'
        LIMIT ${Math.ceil(
          article.contents.length * SETUP_CONFIG.articles.maxMarkedPercentage
        )};
      `;

      return {
        ...article,
        contents: article.contents.map((content) => ({
          ...content,
          Feedback: content.Feedback?.[0],
          marked: markedSentences.find(
            (markedSentence) => markedSentence.id === content.id
          )?.status,
        })),
        qualityStandards: getQualityStandards(article),
      };
    },
  })
  .query('get-recommended-articles', {
    input: ArticleModel.shape.id.unwrap(),
    async resolve({ ctx, input }) {
      const unannotatedArticles = await ctx.prisma.article.findMany({
        where: {
          // Exclude the currently read article
          id: {
            not: input,
          },
          // Exclude articles where the participant has already annotated
          contents: {
            none: {
              Feedback: {
                some: {
                  participantId: ctx.participant.id,
                },
              },
            },
          },
        },
        select: {
          ...SELECT_VIEW,
          coverImage: true,
        },
        take: 3,
      });

      if (
        unannotatedArticles.length <
        SETUP_CONFIG.articles.numRecommendedArticles
      ) {
        // Fill up articles with ones that were annotated the least amount in total
        const leastAnnotatedArticles = await ctx.prisma.article.findMany({
          where: {
            // Exclude the currently read article & the already found articles
            id: {
              notIn: [...unannotatedArticles.map((a) => a.id), input],
            },
          },
          select: {
            ...SELECT_VIEW,
            coverImage: true,
            contents: {
              select: {
                _count: {
                  select: {
                    Feedback: true,
                  },
                },
              },
            },
          },
        });

        const totalFeedbackArticles = leastAnnotatedArticles
          .map((a) => ({
            ...a,
            totalFeedback: a.contents.reduce(
              (acc, c) => acc + c._count.Feedback,
              0
            ),
          }))
          .sort((a, b) => a.totalFeedback - b.totalFeedback);
        while (
          unannotatedArticles.length <
            SETUP_CONFIG.articles.numRecommendedArticles &&
          totalFeedbackArticles.length > 0
        ) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          unannotatedArticles.push(totalFeedbackArticles.shift()!);
        }
      }

      return unannotatedArticles.map((article) => ({
        ...article,
        coverImage:
          article.coverImage || SETUP_CONFIG.articles.placeholderCoverImage,
      }));
    },
  });
