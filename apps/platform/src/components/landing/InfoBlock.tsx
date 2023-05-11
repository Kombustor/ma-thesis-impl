import React from 'react';

import { classNames } from '@mbg/ui';

type Props = {
  image: React.ReactNode;
  text: React.ReactNode;
  reverse?: boolean;
};

export default function InfoBlock({ image, text, reverse }: Props) {
  return (
    <div
      className={classNames('flex flex-wrap gap-8 py-6 justify-between', {
        'flex-row-reverse': reverse,
        'flex-row': !reverse,
      })}
    >
      <div className="flex w-full flex-row items-center justify-center md:basis-1/3">
        {image}
      </div>
      <div className="flex flex-col justify-center gap-6 text-xl md:basis-1/2">
        {text}
      </div>
    </div>
  );
}
