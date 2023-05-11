/**
 * This file contains tRPC's HTTP response handler
 */
import * as trpcNext from '@trpc/server/adapters/next';
import { NextApiRequest, NextApiResponse } from 'next/types';

import { appRouter } from '../../services';
import { createContext } from './create-context';

export default function withCORS(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // FIXME properly set in prod to platform url & chrome extension url
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  return trpcNext.createNextApiHandler({
    router: appRouter,
    /**
     * @link https://trpc.io/docs/context
     */
    createContext,
    /**
     * @link https://trpc.io/docs/error-handling
     */
    onError({ error }) {
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        // send to bug reporting
        console.error('Something went wrong', error);
      }
    },
    /**
     * Enable query batching
     */
    batching: {
      enabled: true,
    },
    /**
     * @link https://trpc.io/docs/caching#api-response-caching
     */
    // responseMeta() {
    //   return {
    //     headers: {
    //     }
    //   }
    // },
  })(req, res);
}
