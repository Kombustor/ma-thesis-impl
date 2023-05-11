import { useRouter } from 'next/router';
import { IconContext } from 'react-icons';
import { HiOutlineCheckCircle } from 'react-icons/hi';

import StudyNextButton from '@/components/layout/StudyNextButton';
import MBGMail from '@/components/misc/MbgMail';
import TextContainer from '@/components/misc/TextContainer';
import StudyLayout from '@/layouts/StudyLayout';
import getProlificCompletionUrl from '@/lib/get-prolific-completion-url';
import { ensureAndTransitionCurrentProgress } from '@/lib/progress';
import withParticipantAuthenticated from '@/lib/with-participant-authenticated';

import {
  ProlificCompletionCodeEvent,
  StudyProgress,
} from '@mbg/api-platform/models/enums';

export const getServerSideProps = withParticipantAuthenticated(
  // eslint-disable-next-line unicorn/consistent-function-scoping
  ({ participant }) =>
    async () => {
      const ssp = await ensureAndTransitionCurrentProgress({
        currentProgress: participant.studyProgress as StudyProgress,
        requiredProgress: StudyProgress.END_10,
      });
      if (ssp) {
        return ssp;
      }

      return getProlificCompletionUrl(ProlificCompletionCodeEvent.SUCCESS);
    }
);

export default function EndPage({ prolificUrl }: { prolificUrl: string }) {
  const router = useRouter();

  return (
    <StudyLayout
      progress={StudyProgress.END_10}
      centerButton
      nextButton={
        <StudyNextButton
          text="Back to Prolific"
          onClick={() => router.push(prolificUrl as string)}
        />
      }
    >
      <TextContainer className="items-center text-center">
        <IconContext.Provider value={{ size: '80' }}>
          <HiOutlineCheckCircle />
        </IconContext.Provider>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-medium">Thank you!</h2>
          <p>You have successfully participated in the study.</p>
        </div>
        <p>
          If you have questions or comments on the study feel free to write a
          mail to <MBGMail />.
        </p>
        <p className="font-bold">
          Press the button below to get redirected to prolific and get your
          participation marked as successful.
        </p>
      </TextContainer>
    </StudyLayout>
  );
}
