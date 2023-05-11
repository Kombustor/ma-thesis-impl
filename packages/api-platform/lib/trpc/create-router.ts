import * as trpc from '@trpc/server';

import isAuthenticated from '../../middleware/authenticated.middleware';
import type { Context } from './create-context';

/**
 * Helper function to create a router with context
 */
export function createRouter() {
  return trpc.router<Context>();
}

export function createProtectedRouter() {
  return createRouter().middleware(isAuthenticated);
}
