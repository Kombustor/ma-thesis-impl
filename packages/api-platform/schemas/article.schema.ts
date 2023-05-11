import { z } from 'zod';

import { buildCrudSchema } from '../lib/trpc/crud-mutation';
import { ArticleModel } from '../models';
import {
  ParsedContentInferenceServiceOutputSchema,
  RequiredContentModel,
} from './content.schema';

// =========== Constants ===========

export const MODEL_NOT_READY = 'Model is not ready.';

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

export const {
  id: ArticleId,
  create: CreateArticleSchema,
  update: UpdateArticleSchema,
} = buildCrudSchema(ArticleModel);
