import { Steps } from 'react-daisyui';

import { PROGRESS_TO_LABEL } from '@/lib/progress-maps';

import { StudyProgress } from '@mbg/api-platform/models/enums';

type Props = {
  progress: StudyProgress;
};

export default function StudySteps({ progress }: Props) {
  const currentPageIdx = Object.values(StudyProgress).indexOf(progress);
  return (
    <Steps className="mb-8 py-4">
      {Object.entries(StudyProgress).map(([key, progress], idx) => (
        <Steps.Step
          color={idx <= currentPageIdx ? 'primary' : undefined}
          key={key}
        >
          {PROGRESS_TO_LABEL[progress]}
        </Steps.Step>
      ))}
    </Steps>
  );
}
