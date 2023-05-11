import superjson from 'superjson';

import { createRouter } from '../lib/trpc/create-router';
import { answerRouter } from './answer/router';
import { adminArticleRouter, articleRouter } from './article/router';
import { contentRouter } from './content/router';
import { feedbackRouter } from './feedback/router';
import {
  adminParticipantRouter,
  publicParticipantRouter,
} from './participant/router';
import { prolificCompletionCodeRouter } from './prolific-completion-code/router';
import { statsRouter } from './stats/router';
import { whitelistRouter } from './whitelist/router';

export const appRouter = createRouter()
  /**
   * Add data transformers
   * @link https://trpc.io/docs/data-transformers
   */
  .transformer(superjson)
  .merge('admin-article.', adminArticleRouter)
  .merge('article.', articleRouter)
  .merge('whitelist.', whitelistRouter)
  .merge('content.', contentRouter)
  .merge('answer.', answerRouter)
  .merge('admin-participant.', adminParticipantRouter)
  .merge('public-participant.', publicParticipantRouter)
  .merge('prolific-completion-code.', prolificCompletionCodeRouter)
  .merge('feedback.', feedbackRouter)
  .merge('stats.', statsRouter);

export type AppRouter = typeof appRouter;
