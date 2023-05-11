import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import StudyNextButton from '@/components/layout/StudyNextButton';
import TextContainer from '@/components/misc/TextContainer';
import StudyLayout from '@/layouts/StudyLayout';
import { ensureAndTransitionCurrentProgress } from '@/lib/progress';
import withParticipantAuthenticated from '@/lib/with-participant-authenticated';

import {
  FeedbackMechanism,
  StudyProgress,
} from '@mbg/api-platform/models/enums';

export const getServerSideProps: GetServerSideProps =
  withParticipantAuthenticated(({ participant }) => async () => {
    const ssp = await ensureAndTransitionCurrentProgress({
      currentProgress: participant.studyProgress as StudyProgress,
      requiredProgress: StudyProgress.INTRO_STUDY_04,
    });
    if (ssp) {
      return ssp;
    }

    return {
      props: {
        feedbackMechanism: participant.feedbackMechanism,
      },
    };
  });

export default function IntroductionStudyPage({
  feedbackMechanism,
}: {
  feedbackMechanism: FeedbackMechanism;
}) {
  const router = useRouter();

  const introMessage =
    feedbackMechanism === FeedbackMechanism.CONTROL
      ? 'In this study, we are interested in how we can gather data for our AI.'
      : 'In this study, we are interested in how we can gather feedback on these AI opinions.';

  return (
    <StudyLayout
      progress={StudyProgress.INTRO_STUDY_04}
      nextButton={
        <StudyNextButton
          onClick={() => router.push('/05-introduction-media-bias')}
        />
      }
    >
      <TextContainer>
        <p>
          The Media Bias Group researches ways to automatically detect and
          visualize bias in news articles. We use AI to detect which sentences
          in an article are biased toward a certain viewpoint.
        </p>
        <p>{introMessage}</p>
      </TextContainer>
    </StudyLayout>
  );
}
