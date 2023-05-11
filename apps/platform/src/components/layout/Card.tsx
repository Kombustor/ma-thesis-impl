import React from 'react';

import { classNames } from '@mbg/ui';

type Props = {
  children: React.ReactNode;
  disableMargin?: boolean;
};

export const CARD_BOX_CLASSES = classNames(' bg-white shadow-lg');

export default function Card({
  children,
  disableMargin,
  ...props
}: Props & React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={classNames(
        props.className,
        CARD_BOX_CLASSES,
        'flex flex-col justify-center p-10 rounded-3xl',
        {
          'mx-auto w-3/4': !disableMargin,
        }
      )}
    >
      {children}
    </div>
  );
}
