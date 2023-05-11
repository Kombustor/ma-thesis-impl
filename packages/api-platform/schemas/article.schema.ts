import type { Article, CoverImage } from '@prisma/client-platform';
import { z } from 'zod';

import { buildCrudSchema } from '../lib/trpc/crud-mutation';
import { ArticleModel } from '../models';
import {
  ParsedContentInferenceServiceOutputSchema,
  RequiredContentModel,
} from './content.schema';

// =========== Constants ===========

export const MODEL_NOT_READY = 'Model is not ready.';

// =========== Quality Standards ===========

export enum OverallRating {
  UNRELIABLE = 'UNRELIABLE',
  QUESTIONABLE = 'QUESTIONABLE',
  RELIABLE = 'RELIABLE',
}

type QualitySummary = {
  rating: OverallRating;
  metQualityStandards: number;
  totalQualityStandards: number;
};

export type QualityStandards = {
  summary: QualitySummary;
  language?: { biasPercentage: number; label: string };
  reporting?: { source: string; credibleSource: boolean };
  objectivity?: { omitsOpinion: boolean };
};

// =========== Marked Sentences ===========

export enum MarkedSentenceReason {
  NOT_ENOUGH_FEEDBACK = 'NOT_ENOUGH_FEEDBACK',
  CONTROVERSE_FEEDBACK = 'CONTROVERSE_FEEDBACK',
}

export const MARKED_EXPLANATIONS: Record<MarkedSentenceReason, string> = {
  [MarkedSentenceReason.NOT_ENOUGH_FEEDBACK]:
    'This sentence has not received enough feedback yet, can you provide some?',
  [MarkedSentenceReason.CONTROVERSE_FEEDBACK]:
    'This sentence has received very contrary feedback, can you help us by providing yours?',
};

// =========== Router Schemata ===========

const RequiredArticleModel = ArticleModel.required();
export const ArticleSchema = RequiredArticleModel.merge(
  z.object({
    contents: RequiredContentModel.array(),
  })
);

export const MetaDataSchema = ArticleModel.pick({
  author: true,
  date: true,
  sitename: true,
  source: true,
  title: true,
});

export const ParsedArticleInferenceServiceOutputSchema = MetaDataSchema.merge(
  z.object({
    contents: ParsedContentInferenceServiceOutputSchema.array(),
  })
);

export type ParsedArticle = z.infer<
  typeof ParsedArticleInferenceServiceOutputSchema
>;

export const ArticleLinkSchema = z.object({
  link: z.string().url(),
  rawHtml: z.string().optional(),
});

export type ArticleLinkSchemaType = z.infer<typeof ArticleLinkSchema>;

export const ArticleRawToParsedInputSchema = ArticleLinkSchema.required();

export type ArticlePreview = Pick<
  Article,
  'id' | 'sitename' | 'date' | 'title'
> & {
  coverImage: CoverImage;
};

export const UpdateCoverImageSchema = z.object({
  id: ArticleModel.shape.id.unwrap(),
  imageUrl: z.string().url(),
});

export const {
  id: ArticleId,
  create: CreateArticleSchema,
  update: UpdateArticleSchema,
} = buildCrudSchema(ArticleModel);
