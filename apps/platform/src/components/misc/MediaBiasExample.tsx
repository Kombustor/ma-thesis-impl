import React from 'react';

import { classNames } from '@mbg/ui';

type Props = {
  heading: string;
  biasedSentence: React.ReactNode;
  notBiasedSentence: React.ReactNode;
};

export default function MediaBiasExample({
  heading,
  biasedSentence,
  notBiasedSentence,
}: Props) {
  const commonClassNames = 'rounded-md px-1';
  return (
    <div className="flex flex-col gap-2 text-center">
      <h2 className="text-2xl">{heading}</h2>
      <p>
        <span
          className={classNames(commonClassNames, 'bg-highlights-yellow-base')}
        >
          {biasedSentence}
        </span>
      </p>
      <p>
        <span
          className={classNames(commonClassNames, 'bg-highlights-gray-base')}
        >
          {notBiasedSentence}
        </span>
      </p>
    </div>
  );
}
