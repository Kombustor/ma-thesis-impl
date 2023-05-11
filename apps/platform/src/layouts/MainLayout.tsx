import React from 'react';

import { classNames } from '@mbg/ui';

type Props = {
  navigation?: React.ReactNode;
  children: React.ReactNode;
  headerFixed?: boolean;
};

export default function MainLayout({
  navigation,
  children,
  headerFixed = true,
  ...props
}: Props & React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={classNames(
        'flex flex-col',
        {
          'h-screen max-h-screen': headerFixed,
        },
        props.className
      )}
    >
      {navigation}
      <div
        className={classNames('flex flex-col px-4 py-2', {
          'overflow-y-scroll grow': headerFixed,
        })}
      >
        {children}
      </div>
    </div>
  );
}
