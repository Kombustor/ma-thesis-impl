import React from 'react';

import CenterLayout from '@/layouts/CenterLayout';

import { LoadingIndicator } from '@mbg/ui';

export default function LoadingLayout() {
  return (
    <CenterLayout>
      <LoadingIndicator />
    </CenterLayout>
  );
}
