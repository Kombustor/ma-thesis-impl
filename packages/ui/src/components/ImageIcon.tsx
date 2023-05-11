/* eslint-disable jsx-a11y/alt-text */
import Image from 'next/image';
import React from 'react';

import { classNames } from '@mbg/ui';

type Props = {
  alt: string;
  src: string;
  notRelative?: boolean;
};

export function ImageIcon({
  alt,
  src,
  notRelative,
  ...props
}: Props & React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={classNames({ relative: !notRelative }, props.className)}
    >
      <Image
        {...{ alt, src }}
        layout="fill"
        className="inline"
        objectFit="contain"
      />
    </div>
  );
}
