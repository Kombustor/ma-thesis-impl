import Head from 'next/head';
import { useRouter } from 'next/router';

import ErrorLayout from '@/layouts/ErrorLayout';

export default function ErrorPage() {
  const router = useRouter();
  return (
    <ErrorLayout>
      <Head>
        <title>Error | NewsUnfold</title>
        <meta property="og:title" content="Error | NewsUnfold" key="title" />
      </Head>
      Error: {router.query.error}
    </ErrorLayout>
  );
}
