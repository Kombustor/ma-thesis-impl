import { FeedbackModel } from '../models';

export const CreateFeedbackSchema = FeedbackModel.pick({
  contentId: true,
  biased: true,
  reason: true,
  createdAt: true,
});
