import { ComparisonIcon } from '@/components/feedback/article/ComparisonIcon';

import { FeedbackMechanism } from '@mbg/api-platform/models/enums';
import { classNames } from '@mbg/ui';

import { HIGHLIGHTED_TEXT_CLASSNAMES } from '../utils';

type Props = {
  mechanism: FeedbackMechanism;
};

export function ArticleLegend({ mechanism }: Props) {
  return (
    <div className="ml-3 inline-flex items-center gap-3">
      <span>|</span>
      {mechanism === FeedbackMechanism.HIGHLIGHTS ? (
        <>
          <span
            className={classNames(
              HIGHLIGHTED_TEXT_CLASSNAMES,
              'bg-highlights-gray-base'
            )}
          >
            Not biased
          </span>
          <span
            className={classNames(
              HIGHLIGHTED_TEXT_CLASSNAMES,
              'bg-highlights-yellow-base'
            )}
          >
            Biased
          </span>
        </>
      ) : (
        <>
          <span className="flex items-center gap-1">
            <ComparisonIcon biased positionClasses="" />
            Marked as biased
          </span>
          <span className="flex items-center gap-1">
            <ComparisonIcon biased={false} positionClasses="" />
            Marked as not biased
          </span>
        </>
      )}
    </div>
  );
}
