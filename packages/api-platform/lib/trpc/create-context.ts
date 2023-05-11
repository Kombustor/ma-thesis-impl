import { PrismaClient } from '@prisma/client-platform';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import * as jwt from 'next-auth/jwt';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

import { getUserById } from '../get-user-by-id';

const prismaClientPropertyName = `__mbg-platform__prisma`;
type GlobalThisWithPrismaClient = typeof globalThis & {
  [prismaClientPropertyName]: PrismaClient;
};

export const prisma = (() => {
  if (process.env.NODE_ENV === `production`) {
    return new PrismaClient({
      log: ['error'],
    });
  } else {
    const newGlobalThis = globalThis as GlobalThisWithPrismaClient;
    if (!newGlobalThis[prismaClientPropertyName]) {
      newGlobalThis[prismaClientPropertyName] = new PrismaClient({
        log: ['query', 'error', 'warn'],
      });
    }
    return newGlobalThis[prismaClientPropertyName];
  }
})();

/**
 * Reads the JWT token from the next-auth session cookie, and returns the
 * session object by decoding the token. Returns null if the JWT token is absent
 * or invalid
 */
export async function getSessionFromCookie({
  req,
}: {
  req: { cookies: NextApiRequestCookies };
}) {
  try {
    // The cookie name differs between http and https urls. Also see here:
    // https://github.com/nextauthjs/next-auth/blob/50fe115df6379fffe3f24408a1c8271284af660b/src/core/lib/cookie.ts#L56-L60
    const isSecure = process.env.NEXTAUTH_URL?.startsWith('https://');
    const cookiePrefix = isSecure ? '__Secure-' : '';
    const sessionToken =
      req.cookies?.[`${cookiePrefix}next-auth.session-token`];

    // decode will throw when the token is invalid
    const decoded = await jwt.decode({
      token: sessionToken,
      secret: String(process.env.SECRET),
    });

    if (!decoded) return;

    return {
      user: { id: String(decoded.sub) },
      expires: new Date(Number(decoded.exp) * 1000).toISOString(),
    };
  } catch (error) {
    console.error('Error decoding JWT', error);
    return;
  }
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  // for API-response caching see https://trpc.io/docs/caching
  const session = await getSessionFromCookie({ req });
  const user = await getUserById(session?.user.id);
  return {
    req,
    res,
    prisma,
    session,
    user,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
