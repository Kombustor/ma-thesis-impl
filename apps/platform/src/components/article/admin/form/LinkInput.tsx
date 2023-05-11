import React from 'react';
import { Input } from 'react-daisyui';
import { UseFormRegisterReturn } from 'react-hook-form';

import { classNames } from '@mbg/ui';

type Props = {
  link?: string;
  registerReturn: UseFormRegisterReturn;
};

export default function LinkInput({ link, registerReturn }: Props) {
  return (
    <Input
      className={classNames('w-full', {
        'text-center placeholder:text-center': link === undefined,
      })}
      id="link"
      type="url"
      value={link}
      readOnly={link ? true : false}
      placeholder={link || 'https://super.cool.article.io'}
      {...registerReturn}
    />
  );
}
