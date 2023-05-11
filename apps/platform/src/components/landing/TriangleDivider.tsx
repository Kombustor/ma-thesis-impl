import React from 'react';

import { classNames } from '@mbg/ui';

export default function TriangleDivider(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={classNames('h-24 bg-center bg-repeat-x', props.className)}
      style={{
        backgroundImage: 'url("/triangle.svg")',
      }}
    />
  );
}
