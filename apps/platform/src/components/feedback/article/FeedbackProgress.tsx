import { Progress } from 'react-daisyui';

import { CARD_BOX_CLASSES } from '@/components/layout/Card';

import { classNames } from '@mbg/ui';

type Props = {
  total: number;
  done: number;
};

export function FeedbackProgress({ total, done }: Props) {
  return (
    <div className={classNames(CARD_BOX_CLASSES, 'p-5 rounded-lg')}>
      <span className="font-bold">
        {done}/{total} sentences rated
      </span>
      <Progress value={done / total} />
    </div>
  );
}
