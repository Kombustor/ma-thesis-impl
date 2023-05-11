import { NextApiHandler } from 'next';
import { nextHandler } from 'trpc-playground/handlers/next';

import { appRouter } from '@mbg/api-platform/services';

const setupHandler = nextHandler({
  router: appRouter,
  // tRPC api path, pages/api/trpc/[trpc].ts in this case
  trpcApiEndpoint: '/api/trpc',
  playgroundEndpoint: '/api/trpc-playground',
  request: {
    superjson: true,
  },
});

const handler: NextApiHandler = async (req, res) => {
  const playgroundHandler = await setupHandler;
  await playgroundHandler(req, res);
};

const prodHandler: NextApiHandler = async (req, res) => {
  res.end();
};

export default process.env.NODE_ENV === 'development' ? handler : prodHandler;
