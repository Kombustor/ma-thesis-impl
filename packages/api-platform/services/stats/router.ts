import { createProtectedRouter } from '../../lib/trpc/create-router';
import { HtmlType } from '../../models/enums';
import { SETUP_CONFIG } from '../../setupconfig';

export const statsRouter = createProtectedRouter().query('get', {
  async resolve({ ctx }) {
    const { prisma } = ctx;
    const participants = await prisma.participant.findMany({
      select: {
        _count: {
          select: {
            Feedback: true,
          },
        },
      },
    });
    const participantsNoZeroFeedback = participants.filter(
      (x) => x._count.Feedback > 0
    );
    const avgFeedbackCount = (
      participantsNoZeroFeedback
        .map((x) => x._count.Feedback)
        .reduce((a, b) => a + b, 0) / participantsNoZeroFeedback.length
    ).toFixed(2);
    const medianFeedbackCount = participantsNoZeroFeedback
      .map((x) => x._count.Feedback)
      .sort((a, b) => a - b)
      [Math.floor(participantsNoZeroFeedback.length / 2)].toFixed(2);

    const topTenContentFeedbackCount = async (order: 'asc' | 'desc') => {
      const data = await prisma.content.findMany({
        select: {
          text: true,
          _count: {
            select: {
              Feedback: true,
            },
          },
        },
        orderBy: { Feedback: { _count: order } },
        where: {
          Feedback: {
            some: {},
          },
        },
        take: 10,
      });

      return data.map(({ _count, text }) => ({
        content: text,
        feedbackCount: _count.Feedback,
      }));
    };

    const sentenceStats: {
      status: string;
      count: number;
    }[] = await prisma.$queryRaw`
        SELECT status, COUNT(*) as count FROM (
          SELECT SpanContent.id,
          CASE
            WHEN feedbackCount > 0 AND feedbackCount < ${SETUP_CONFIG.articles.majorityVoteTreshold} THEN 'NOT_ENOUGH_FEEDBACK'
            WHEN feedbackCount >= ${SETUP_CONFIG.articles.majorityVoteTreshold} AND "avgBiased" BETWEEN ${SETUP_CONFIG.articles.controverseBias.lowerBound} AND ${SETUP_CONFIG.articles.controverseBias.upperBound} THEN 'CONTROVERSE_MAJORITY_VOTE'
            WHEN feedbackCount >= ${SETUP_CONFIG.articles.majorityVoteTreshold} THEN 'MAJORITY_VOTE'
            ELSE 'NO_FEEDBACK'
          END AS status
          FROM (
            SELECT id
            FROM "Content"
            WHERE "htmlType" = ${HtmlType.SPAN}
          ) AS SpanContent
          LEFT JOIN (
            SELECT "contentId", COUNT(*) AS feedbackCount, AVG(biased::int) AS "avgBiased"
            FROM "Feedback"
            GROUP BY "contentId"
          ) AS ContentFeedback ON ContentFeedback."contentId" = SpanContent.id
        ) as SpanContentWithFeedback
        GROUP BY status
        ORDER BY count DESC;
      `;

    return {
      participantStats: {
        avgFeedbackCount,
        medianFeedbackCount,
      },
      contentStats: {
        sentenceStats,
        topTenMostFeedback: await topTenContentFeedbackCount('desc'),
        topTenLeastFeedback: await topTenContentFeedbackCount('asc'),
      },
    };
  },
});
