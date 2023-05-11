import React from 'react';

import { classNames } from '@mbg/ui';

type Props = {
  fullHeight?: boolean;
  width?: string;
  height?: string;
  bgCircles?: string;
};

export function LoadingIndicator({
  fullHeight,
  width = 'w-2',
  height = 'h-2',
  bgCircles = 'bg-white',
  ...props
}: Props & React.ComponentProps<'div'>) {
  const circleClasses = classNames('rounded-full', width, height, bgCircles);
  return (
    <div
      {...props}
      className={classNames(
        { 'flex grow flex-col justify-center': fullHeight },
        props.className
      )}
    >
      <div className="flex animate-pulse items-center justify-center space-x-2">
        <div className={circleClasses} />
        <div className={circleClasses} />
        <div className={circleClasses} />
      </div>
    </div>
  );
}
