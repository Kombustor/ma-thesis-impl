import { buildCrudSchema } from '../lib/trpc/crud-mutation';
import { ParticipantModel } from '../models';

export const { id: ParticipantId, update: UpdateParticipantSchema } =
  buildCrudSchema(ParticipantModel);

export const dataProcessingConsentSchema = ParticipantModel.pick({
  dataProcessingConsent: true,
});
