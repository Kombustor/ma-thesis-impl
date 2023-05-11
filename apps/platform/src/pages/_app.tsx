import type { AppProps } from 'next/app';
import Router from 'next/router';
import Script from 'next/script';
import NProgress from 'nprogress';
import { ReactQueryDevtools } from 'react-query/devtools';

import '@/styles/tailwind.css';
import 'nprogress/nprogress.css';

import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

import withTrpc from '@mbg/api-platform/lib/trpc/withTrpc';

// Page loading indicators
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Script
        strategy="lazyOnload"
        data-website-id={process.env.NEXT_PUBLIC_ANALYTICS_ID}
        src={process.env.NEXT_PUBLIC_ANALYTICS_URL}
      />
      <Head>
        <title>NewsUnfold - See through Media Bias</title>
        <meta
          property="og:title"
          content="NewsUnfold - See through Media Bias"
          key="title"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5928E5" />
      </Head>
      <SessionProvider session={session}>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Component {...pageProps} />
        {process.env.NODE_ENV !== 'production' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </SessionProvider>
    </>
  );
}

export default withTrpc(MyApp);
