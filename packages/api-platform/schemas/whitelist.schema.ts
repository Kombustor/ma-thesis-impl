import { buildCrudSchema } from '../lib/trpc/crud-mutation';
import { EmailWhitelistModel } from '../models';

export const {
  id: EmailWhitelistId,
  create: CreateEmailWhitelistSchema,
  update: UpdateEmailWhitelistSchema,
} = buildCrudSchema(EmailWhitelistModel);
