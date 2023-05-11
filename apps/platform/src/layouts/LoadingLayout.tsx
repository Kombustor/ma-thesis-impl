import React from 'react';

import MainLayout from '@/layouts/MainLayout';

import { LoadingIndicator } from '@mbg/ui';

type Props = {
  children?: React.ReactNode;
};

export default function LoadingLayout({ children }: Props) {
  return (
    <MainLayout>
      <LoadingIndicator fullHeight bgCircles="bg-neutral" />
      {children}
    </MainLayout>
  );
}
