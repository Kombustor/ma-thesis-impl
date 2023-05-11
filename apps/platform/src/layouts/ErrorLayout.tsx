import React from 'react';
import { HiExclamation } from 'react-icons/hi';

import CenterLayout from '@/layouts/CenterLayout';

type Props = {
  children: React.ReactNode;
};

export default function ErrorLayout({ children }: Props) {
  return (
    <CenterLayout>
      <div className="flex flex-col items-center text-lg">
        <HiExclamation size="3em" />
        {children}
      </div>
    </CenterLayout>
  );
}
