import { FeedbackModel } from '../models';

export const CreateManyFeedbackSchema = FeedbackModel.pick({
  contentId: true,
  basedOnClassifier: true,
  biased: true,
  createdAt: true,
}).array();
