import { classNames } from '@mbg/ui';

import { HIGHLIGHTED_TEXT_CLASSNAMES } from '../utils';

type Props = {
  biased: boolean;
};

export function SentenceBiasedText({ biased }: Props) {
  const highlightClasses = classNames(HIGHLIGHTED_TEXT_CLASSNAMES, {
    'bg-highlights-gray-active': !biased,
    'bg-highlights-yellow-active': biased,
  });
  return (
    <>
      <div className="mb-2 block">
        <span className={classNames(highlightClasses, 'font-bold')}>
          {biased ? 'Biased' : 'Not biased'}
        </span>
      </div>
      <span className={highlightClasses}>Do you agree with the AI?</span>
    </>
  );
}
