import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { z } from 'zod';

import { ContentModel } from '../models';
import {
  MODEL_NOT_READY,
  ParsedArticleInferenceServiceOutputSchema,
} from '../schemas/article.schema';
import { AnalyzedContentInferenceServiceOutputSchema } from '../schemas/content.schema';

const ContentToAnalyzeSchema = ContentModel.pick({ id: true, text: true });

export type ContentToAnalyze = z.infer<typeof ContentToAnalyzeSchema>;

export async function rawHtmlToContent(rawHtml: string) {
  const response = await axios
    .post(`${process.env.INFERENCE_URL}/raw-html-to-content`, { rawHtml })
    .catch(({ response: { status, statusText } }) => {
      if (status === 502) {
        console.error('Interference server is not fully booted.');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: MODEL_NOT_READY,
        });
      } else if (status === 400) {
        const errorMessage = 'Could not parse raw HTML of the provided link.';
        console.error(errorMessage);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: errorMessage,
        });
      } else if (status !== 200) {
        const errorMessage =
          'Could not parse article due to unknown error, contact the system admin.';
        console.error(errorMessage, status, statusText);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: errorMessage,
        });
      }
    });

  return ParsedArticleInferenceServiceOutputSchema.parse({
    ...response?.data,
    date: new Date(response?.data.date),
  });
}

export async function analyze(contentsToAnalyze: ContentToAnalyze[]) {
  const response = await axios.post(`${process.env.INFERENCE_URL}/analyze`, {
    contentsToAnalyze,
  });

  if (response.status !== 200) {
    console.error('Could not analyze article content', response.statusText);
    return;
  }

  return AnalyzedContentInferenceServiceOutputSchema.parse(response.data);
}
