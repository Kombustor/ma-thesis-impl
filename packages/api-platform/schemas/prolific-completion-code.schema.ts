import { buildCrudSchema } from '../lib/trpc/crud-mutation';
import { ProlificCompletionCodeModel } from '../models';

export const {
  id: ProlificCompletionCodeId,
  update: UpdateProlificCompletionCodeSchema,
  create: CreateProlificCompletionCodeSchema,
} = buildCrudSchema(ProlificCompletionCodeModel);
