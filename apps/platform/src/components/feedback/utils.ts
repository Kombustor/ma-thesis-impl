import { InferQueryOutput } from '@mbg/api-platform/lib/trpc';
import { classNames } from '@mbg/ui';

export const HIGHLIGHTED_TEXT_CLASSNAMES = classNames('px-1 rounded-md');
export const INDICATOR_CLASSES = classNames(
  'inline-block text-white rounded-full flex items-center justify-center'
);
export const INDICATOR_POSITION_CLASSES = classNames(
  'absolute -left-1 -top-1.5'
);
export const INDICATOR_SIZE_CLASSES = classNames('h-3 w-3');
export const INDICATOR_TEXT_CLASSES = classNames('text-[12px] leading-[12px]');

export type FeedbackMechanismProps = {
  topRef: React.RefObject<HTMLSpanElement>;
  article: InferQueryOutput<'article.get-articles'>[0];
  isLastArticle: boolean;
  gotoNextArticle: () => void;
};
