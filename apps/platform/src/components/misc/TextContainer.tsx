import React from 'react';

import { classNames } from '@mbg/ui';

type Props = { children: React.ReactNode };

export default function TextContainer({
  children,
  className,
}: Props & React.ComponentProps<'div'>) {
  return (
    <div className={classNames('flex flex-col gap-4 p-10 text-xl', className)}>
      {children}
    </div>
  );
}
