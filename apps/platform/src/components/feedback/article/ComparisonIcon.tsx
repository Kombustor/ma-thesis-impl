import { classNames } from '@mbg/ui';

import {
  INDICATOR_CLASSES,
  INDICATOR_POSITION_CLASSES,
  INDICATOR_SIZE_CLASSES,
  INDICATOR_TEXT_CLASSES,
} from '../utils';

type Props = {
  biased: boolean;
  positionClasses?: string;
  sizeClasses?: string;
  textClasses?: string;
};

export function ComparisonIcon({
  biased,
  positionClasses = INDICATOR_POSITION_CLASSES,
  sizeClasses = INDICATOR_SIZE_CLASSES,
  textClasses = INDICATOR_TEXT_CLASSES,
}: Props) {
  // Hide if the biased is undefined
  if (biased === undefined) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  return (
    <div
      className={classNames(
        INDICATOR_CLASSES,
        'shadow-md text-center',
        positionClasses,
        sizeClasses,
        textClasses,
        {
          'bg-highlights-yellow-active': biased,
          'bg-highlights-gray-active': !biased,
        }
      )}
    >
      <span>{biased ? 'B' : 'N'}</span>
    </div>
  );
}
