import { differenceInSeconds, formatDuration } from 'date-fns';
import percentile from 'percentile';

import { createProtectedRouter } from '../../lib/trpc/create-router';
import { FeedbackMechanism, StudyProgress } from '../../models/enums';

export const statsRouter = createProtectedRouter().query('get', {
  async resolve({ ctx }) {
    const { prisma } = ctx;
    const participants = await prisma.participant.findMany({
      select: {
        attentionCheckFailures: true,
        feedbackMechanism: true,
        progress: {
          select: { progress: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            Feedback: true,
          },
        },
      },
    });
    const avgFeedbackCount = (
      participants.map((x) => x._count.Feedback).reduce((a, b) => a + b, 0) /
      participants.length
    ).toFixed(2);

    const filterAttentionCheckFailures = (amount: number) =>
      participants.filter((x) => x.attentionCheckFailures === amount).length;

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

    const timeSpentPerParticipant = participants
      .filter((x) => x.progress[0].progress === StudyProgress.END_10)
      .map((x) =>
        differenceInSeconds(
          x.progress[0].createdAt,
          x.progress[x.progress.length - 1].createdAt
        )
      )
      .sort();

    const averageTimeSpentInStudy =
      timeSpentPerParticipant.reduce((a, b) => a + b, 0) /
      timeSpentPerParticipant.length;

    const percentilesKeys = ['10-th', '50-th', '90-th'];
    const percentiles = Object.fromEntries(
      (percentile([10, 50, 90], timeSpentPerParticipant) as number[]).map(
        (x, idx) => [percentilesKeys[idx], formatDuration({ seconds: x })]
      )
    );

    return {
      participantStats: {
        avgFeedbackCount,
        attentionCheckFailures: {
          totalFirstTime: filterAttentionCheckFailures(1),
          totalSecondTime: filterAttentionCheckFailures(2),
        },
        progressDistribution: {
          // eslint-disable-next-line unicorn/no-array-reduce
          ...participants.reduce((a, b) => {
            a[b.progress[0].progress] = a[b.progress[0].progress] + 1;
            return a;
          }, Object.fromEntries(Object.keys(StudyProgress).map((key) => [key, 0]))),
          Total: participants.length,
        },
        feedbackMechanismDistribution: {
          // eslint-disable-next-line unicorn/no-array-reduce
          ...participants.reduce((a, { feedbackMechanism }) => {
            if (feedbackMechanism === null) {
              a['NONE'] = a['NONE'] + 1;
            } else {
              a[feedbackMechanism] = a[feedbackMechanism] + 1;
            }
            return a;
          }, Object.fromEntries(Object.keys({ ...FeedbackMechanism, NONE: 0 }).map((key) => [key, 0]))),
        },
      },
      contentStats: {
        topTenMostFeedback: await topTenContentFeedbackCount('desc'),
        topTenLeastFeedback: await topTenContentFeedbackCount('asc'),
      },
      timeStats: {
        average: formatDuration({ seconds: averageTimeSpentInStudy }),
        percentiles,
      },
    };
  },
});
