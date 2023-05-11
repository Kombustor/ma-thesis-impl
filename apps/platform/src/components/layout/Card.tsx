import React from 'react';

import { classNames } from '@mbg/ui';

type Props = {
  children: React.ReactNode;
  disableMargin?: boolean;
  disablePadding?: boolean;
};

export const CARD_BOX_CLASSES = classNames(' bg-white shadow-lg');

export default function Card({
  children,
  disableMargin,
  disablePadding,
  ...props
}: Props & React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={classNames(
        props.className,
        CARD_BOX_CLASSES,
        'flex flex-col justify-center rounded-3xl',
        {
          'mx-auto w-3/4': !disableMargin,
          'p-6 lg:p-10': !disablePadding,
        }
      )}
    >
      {children}
    </div>
  );
}
