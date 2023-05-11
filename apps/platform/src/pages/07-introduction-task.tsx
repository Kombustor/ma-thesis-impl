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
      requiredProgress: StudyProgress.INTRO_TASK_07,
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

export default function IntroductionTaskPage({
  feedbackMechanism,
}: {
  feedbackMechanism: FeedbackMechanism;
}) {
  const router = useRouter();
  const explanationText = {
    [FeedbackMechanism.HIGHLIGHTS]:
      'Our classifier is an algorithm that predicts a sentence as biased or not biased, based on news articles, observed in the past. Nevertheless, our classifier makes mistakes, and we need your help to fix them. On the following pages, you will see two news articles we ask you to read carefully. In each article, one sentence is highlighted. The color as well as the box to the right shows you if our classifier thinks it is biased or not. Then, you can choose if you agree or disagree with it. You can click on every sentence and go back to the ones you already gave feedback on. Work through the article freely and click the “Next” button in the lower right corner whenever you want to get to the next article.',
    [FeedbackMechanism.COMPARISON]:
      'Our classifier is an algorithm that predicts a sentence as biased or not biased, based on news articles, observed in the past. Nevertheless, our classifier makes mistakes, and we need your help to fix them. On the following pages, you will see two news articles we ask you to read carefully. In each article, a pair of sentences is highlighted. The color as well as the first box to the right shows you if our classifier thinks it is biased or not. In this box, you can choose if you agree or disagree with it. The second sentence is for you to decide if it is biased or not. In the second box, you can mark it as biased or non-biased. Work through the article freely and click the “Next” button in the lower right corner whenever you want to get to the next article.',
    [FeedbackMechanism.CONTROL]:
      'On the following pages, you will see two news articles we ask you to read carefully. Click on a sentence and mark it as biased or non-biased in the box to the right. Work through the article freely and click the “Next” button in the lower right corner whenever you want to get to the next article.',
  };

  return (
    <StudyLayout
      progress={StudyProgress.INTRO_TASK_07}
      nextButton={
        <StudyNextButton onClick={() => router.push('/08-articles')} />
      }
    >
      <TextContainer>
        <p className="text-2xl font-medium leading-tight">Task:</p>
        <p>{explanationText[feedbackMechanism]}</p>
      </TextContainer>
    </StudyLayout>
  );
}
