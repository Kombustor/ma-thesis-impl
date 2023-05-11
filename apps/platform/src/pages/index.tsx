import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import StudyNextButton from '@/components/layout/StudyNextButton';
import TextContainer from '@/components/misc/TextContainer';
import StudyLayout from '@/layouts/StudyLayout';
import { ensureAndTransitionCurrentProgress } from '@/lib/progress';
import { loadParticipant } from '@/lib/with-participant-authenticated';

import { StudyProgress } from '@mbg/api-platform/models/enums';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // Get existing cookie
  const existingCookie = req.cookies['participantSession'];

  // If we have an existing cookie
  if (existingCookie) {
    // Validate participant id
    const participant = await loadParticipant(existingCookie);

    // If the participant is invalid, redirect to show error
    if (!participant) {
      return {
        redirect: {
          destination:
            '/error?error=Invalid session, please try clearing your cookies and re-joining from Prolific',
          permanent: false,
        },
      };
    }

    // Validate that the current study progress is START_01 and redirect to the correct one if not
    const ssp = await ensureAndTransitionCurrentProgress({
      currentProgress: participant.studyProgress as StudyProgress,
      requiredProgress: StudyProgress.START_01,
    });
    if (ssp) {
      return ssp;
    }

    // Else it's fine, render the index page
    return {
      props: {},
    };
  }

  // Check mode
  const IS_PROLIFIC = !!process.env.PROLIFIC_API_TOKEN;

  // If we're not in Prolific mode, redirect to create session
  if (!IS_PROLIFIC) {
    return {
      redirect: {
        destination: '/create-session',
        permanent: false,
      },
    };
  }

  // Else redirect to create prolific session
  return {
    redirect: {
      destination: `/create-session/prolific${req.url}`,
      permanent: false,
    },
  };
};

export default function IndexPage() {
  const router = useRouter();
  return (
    <StudyLayout
      progress={StudyProgress.START_01}
      nextButton={
        <StudyNextButton
          onClick={() => {
            router.push('/02-who-we-are');
          }}
          text="Start"
        />
      }
      centerButton
    >
      <TextContainer>
        <p>
          We welcome you to participate in our survey about media bias. The goal
          of this survey is to test your abilities of detecting and judging bias
          in news articles.
        </p>
        <p>The study takes most people around 7-12 minutes to complete.</p>
      </TextContainer>
    </StudyLayout>
  );
}
