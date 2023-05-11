import { Alert, Button } from 'react-daisyui';
import { HiHand } from 'react-icons/hi';

type Props = {
  start: () => void;
  dismiss: () => void;
};

export default function TutorialBanner({ start, dismiss }: Props) {
  return (
    <Alert className="mb-4 bg-white">
      <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-row items-center gap-2">
          <HiHand className="hidden w-14 rotate-45 md:block" size="40px" />
          <div>
            Welcome to News Unfold! Our goal is to help people read news more
            critically. Let&apos;s start with a quick walkthrough that will show
            you how to get the best out of the news you consume!
          </div>
        </div>
        <div className="flex w-full flex-row items-stretch gap-1 md:w-auto">
          <Button
            className="umami--click--tutorial-start w-1/2 whitespace-nowrap lg:w-auto"
            onClick={start}
          >
            Start tutorial
          </Button>
          <Button
            className="umami--click--tutorial-dismiss w-1/2 lg:w-auto"
            onClick={dismiss}
            color="ghost"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </Alert>
  );
}
