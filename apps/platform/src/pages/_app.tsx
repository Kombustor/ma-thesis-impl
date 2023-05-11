import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { ReactQueryDevtools } from 'react-query/devtools';

import '@/styles/tailwind.css';
import 'nprogress/nprogress.css';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

import withTrpc from '@mbg/api-platform/lib/trpc/withTrpc';

// Page loading indicators
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Component {...pageProps} />
      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </SessionProvider>
  );
}

export default withTrpc(MyApp);
