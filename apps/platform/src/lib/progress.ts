import { PROGRESS_TO_ROUTE } from '@/lib/progress-maps';
import withParticipantAuthenticated from '@/lib/with-participant-authenticated';

import { prisma } from '@mbg/api-platform/lib/trpc/create-context';
import { StudyProgress } from '@mbg/api-platform/models/enums';

type Props = {
  currentProgress: StudyProgress;
  requiredProgress: StudyProgress;
  allowTransitionFrom?: StudyProgress;
  participantId?: string;
};

export const ensureAndTransitionCurrentProgress = async ({
  currentProgress,
  requiredProgress,
  ...props
}: Props) => {
  // If the current progress is not the required progress
  if (currentProgress !== requiredProgress) {
    // If the current progress is one where we allow transition from
    if (
      props.allowTransitionFrom &&
      props.participantId &&
      currentProgress === props.allowTransitionFrom
    ) {
      await prisma.participantProgress.create({
        data: {
          participantId: props.participantId,
          progress: requiredProgress,
        },
      });
    } else {
      // Otherwise, redirect to the current progress
      return {
        redirect: {
          destination: PROGRESS_TO_ROUTE[currentProgress],
          permanent: false,
        },
      };
    }
  }
};

export const requireProgress = (
  progress: StudyProgress,
  allowTransitionFrom?: StudyProgress
) => {
  return () =>
    withParticipantAuthenticated(
      // eslint-disable-next-line unicorn/consistent-function-scoping
      ({ participant }) =>
        async () => {
          const ssp = await ensureAndTransitionCurrentProgress({
            currentProgress: participant.studyProgress as StudyProgress,
            requiredProgress: progress,
            allowTransitionFrom: allowTransitionFrom,
            participantId: participant.id,
          });

          // If there's a redirect to the current progress, return it
          if (ssp) {
            return ssp;
          }
          return {
            props: {},
          };
        }
    );
};
