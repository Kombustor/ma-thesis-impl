import { StudyProgress } from '@mbg/api-platform/models/enums';

// This is in a separate file because we use it in client-side components, but we cannot import progress there because it imports and uses the Prisma client

export const PROGRESS_TO_ROUTE: Record<StudyProgress, string> = {
  START_01: '/',
  DATA_PROCESSING_02: '/02-who-we-are',
  QUESTIONS_03: '/03-questions',
  INTRO_STUDY_04: '/04-introduction-study',
  INTRO_BIAS_05: '/05-introduction-media-bias',
  ATTENTION_CHECK_06: '/06-attention-check',
  INTRO_TASK_07: '/07-introduction-task',
  ARTICLES_08: '/08-articles',
  TRUST_CHECK_09: '/09-trust-check',
  END_10: '/10-end',
};

export const PROGRESS_TO_LABEL: Record<StudyProgress, string> = {
  START_01: 'Welcome',
  DATA_PROCESSING_02: 'Who we are',
  QUESTIONS_03: 'Questions',
  INTRO_STUDY_04: 'Intro study',
  INTRO_BIAS_05: 'Intro media bias',
  ATTENTION_CHECK_06: 'Quiz',
  INTRO_TASK_07: 'Task',
  ARTICLES_08: 'Articles',
  TRUST_CHECK_09: 'Trust check',
  END_10: 'End',
};
