import { useRouter } from 'next/router';
import React from 'react';

import ErrorLayout from '@/layouts/ErrorLayout';

export default function ErrorPage() {
  const router = useRouter();
  return <ErrorLayout>Error: {router.query.error}</ErrorLayout>;
}
