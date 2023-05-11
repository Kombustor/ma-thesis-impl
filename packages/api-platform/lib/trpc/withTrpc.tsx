import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { withTRPC } from '@trpc/next';

import { transformer } from '.';
import type { AppRouter } from '../../services';

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }
  // // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // // reference for render.com
  // if (process.env.RENDER_INTERNAL_HOSTNAME) {
  //   return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  // }

  // Should work out of the box for fly as we don't use workers but VMs

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 4000}`;
}

const wTRPC = withTRPC<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api/trpc`;
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url,
        }),
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: {
        defaultOptions: {
          queries: {
            // access to properties will be tracked, and the component will only re-render when one of the tracked properties change.
            notifyOnChangeProps: 'tracked',
            // Disable focus refetching
            refetchOnWindowFocus: false,
          },
        },
      },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
  // FIXME
  // https://github.com/trpc/trpc/issues/596#issuecomment-981762190
  // https://github.com/pranavdharwadkar/calcom/blob/df7abdfc0613a3bef06310a3d1f82ce2a7038ac9/apps/web/server/lib/ssr.ts
  // https://github.com/pranavdharwadkar/calcom/blob/df7abdfc0613a3bef06310a3d1f82ce2a7038ac9/apps/web/pages/auth/error.tsx#L43
  // https://reactjs.org/docs/higher-order-components.html
  /**
   * Set headers or status code when doing SSR
   */
  // responseMeta({ clientErrors }) {
  //   if (clientErrors.length > 0) {
  //     // propagate http first error from API calls
  //     return {
  //       status: clientErrors[0].data?.httpStatus ?? 500,
  //     };
  //   }

  //   // for app caching with SSR see https://trpc.io/docs/caching

  //   return {};
  // },
});

export default wTRPC;
