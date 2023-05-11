import Zod, { z } from 'zod';

export const attentionCheckAnswerSchema = z.object({
  answer: z.string().min(1),
});

export type AttentionCheckAnswer = Zod.infer<typeof attentionCheckAnswerSchema>;

export enum AttentionCheckResult {
  SUCCESS,
  FAILED_ATTEMPT,
  FINAL_FAILURE,
}
export const maxAttempts = 2;
