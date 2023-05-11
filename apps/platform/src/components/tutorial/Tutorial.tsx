import dynamic from 'next/dynamic';
import { Props as JRProps, STATUS, Step } from 'react-joyride';

const JoyRideNoSSR = dynamic(() => import('react-joyride'), { ssr: false });

export const DEFAULT_STEP_PROPS: Partial<Step> = {
  disableBeacon: true,
  isFixed: true,
  placement: 'auto',
};

type Props = JRProps & {
  onFinish?: () => void;
};

export default function Tutorial({ onFinish, ...props }: Props) {
  return (
    <JoyRideNoSSR
      scrollToFirstStep
      showSkipButton
      {...props}
      callback={({ status }) => {
        (status === STATUS.FINISHED || status === STATUS.SKIPPED) &&
          onFinish?.();
      }}
      steps={props.steps.map((step) => ({ ...DEFAULT_STEP_PROPS, ...step }))}
      locale={{
        back: 'Previous',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        open: 'Open the dialog',
        skip: 'End Tutorial',
      }}
      styles={{
        options: {
          primaryColor: '#5928E5',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
      }}
    />
  );
}
