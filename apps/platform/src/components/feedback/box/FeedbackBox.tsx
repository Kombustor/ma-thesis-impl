import React from 'react';

import { CARD_BOX_CLASSES } from '@/components/layout/Card';

import { classNames } from '@mbg/ui';

type Props = {
  children: React.ReactNode;
};

export default function FeedbackBox({ children }: Props) {
  return (
    <div className={classNames(CARD_BOX_CLASSES, 'rounded-lg p-5')}>
      {children}
    </div>
  );
}
