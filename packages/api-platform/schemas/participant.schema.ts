import { buildCrudSchema } from '../lib/trpc/crud-mutation';
import { ParticipantModel } from '../models';

export const { id: ParticipantId, update: UpdateParticipantSchema } =
  buildCrudSchema(ParticipantModel.omit({ source: true }));

export const dataUsableForResearchSchema = ParticipantModel.pick({
  dataUsableForResearch: true,
});

export const dataProcessingConsentSchema = ParticipantModel.pick({
  dataProcessingConsent: true,
});
