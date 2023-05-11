import React from 'react';

import { classNames } from '@mbg/ui';

type Props = {
  children: React.ReactNode;
  outerMargin?: boolean;
};

export function FeedbackMechanismWrapper({
  outerMargin = true,
  children,
}: Props) {
  return (
    <div
      className={classNames('m-auto mb-20 flex flex-row justify-center gap-4', {
        'md:mx-7': outerMargin,
      })}
    >
      {children}
    </div>
  );
}
