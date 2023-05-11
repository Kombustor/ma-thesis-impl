import { z } from 'zod';

import { ContentModel } from '../models';

export type { Content } from '@prisma/client-platform';

export const ContentId = ContentModel.shape.id.unwrap();
export const RequiredContentModel = ContentModel.required();

export const ParsedContentInferenceServiceOutputSchema = ContentModel.pick({
  text: true,
  htmlType: true,
  indexInArticle: true,
  paragraphIndex: true,
});

export const AnalyzedContentInferenceServiceOutputSchema = ContentModel.pick({
  id: true,
  biased: true,
}).array();

export const AddGroundTruthInput = z
  .object({
    ids: ContentId.array(),
  })
  .merge(ContentModel.pick({ groundTruthBiased: true }));
