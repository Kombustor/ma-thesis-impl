import { AnswerModel } from '../models/answer';

export const answerSchema = AnswerModel.omit({ id: true, participantId: true });

export type Answer = Zod.infer<typeof answerSchema>;
