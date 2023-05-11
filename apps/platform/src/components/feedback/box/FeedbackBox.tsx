import React from 'react';

import { CARD_BOX_CLASSES } from '@/components/layout/Card';

import { classNames } from '@mbg/ui';

type Props = {
  children: React.ReactNode;
};

export default function FeedbackBox({
  children,
  ...props
}: Props & React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={classNames(
        CARD_BOX_CLASSES,
        'rounded-lg p-5',
        props.className
      )}
    >
      {children}
    </div>
  );
}
