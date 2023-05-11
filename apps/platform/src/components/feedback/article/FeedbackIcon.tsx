import { HiCheck, HiX } from 'react-icons/hi';

import { classNames } from '@mbg/ui';

import { INDICATOR_CLASSES, INDICATOR_POSITION_CLASSES } from '../utils';

type Props = {
  userBiased: boolean | undefined;
  classifierBiased: boolean;
};

export function FeedbackIcon({ userBiased, classifierBiased }: Props) {
  if (userBiased === undefined) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  const agreed = userBiased === classifierBiased;
  const IconType = agreed ? HiCheck : HiX;
  return (
    <IconType
      className={classNames(INDICATOR_CLASSES, INDICATOR_POSITION_CLASSES, {
        'bg-feedback-agree': agreed,
        'bg-feedback-disagree': !agreed,
      })}
    />
  );
}
