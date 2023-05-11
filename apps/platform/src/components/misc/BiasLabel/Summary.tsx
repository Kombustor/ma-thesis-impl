import React from 'react';

import SealQuestionable from '@/components/misc/BiasLabel/icons/SealQuestionable';
import SealReliable from '@/components/misc/BiasLabel/icons/SealReliable';
import SealUnrealiable from '@/components/misc/BiasLabel/icons/SealUnreliable';

import { OverallRating } from '@mbg/api-platform/schemas/article.schema';
import { classNames } from '@mbg/ui';

const BACKGROUND_COLOR: Record<OverallRating, string> = {
  [OverallRating.UNRELIABLE]: 'bg-red-200',
  [OverallRating.QUESTIONABLE]: 'bg-yellow-200',
  [OverallRating.RELIABLE]: 'bg-green-200',
};

const SEAL: Record<OverallRating, React.FC> = {
  [OverallRating.UNRELIABLE]: SealUnrealiable,
  [OverallRating.QUESTIONABLE]: SealQuestionable,
  [OverallRating.RELIABLE]: SealReliable,
};

export type SummaryProps = {
  rating: OverallRating;
  metQualityStandards: number;
  totalQualityStandards: number;
};

export default function Summary({
  rating,
  metQualityStandards,
  totalQualityStandards,
}: SummaryProps) {
  // Capitalize only the first letter of rating
  const transformedRating =
    rating.charAt(0).toUpperCase() + rating.slice(1).toLowerCase();
  const Seal = SEAL[rating];
  return (
    <div
      className={classNames(
        'flex flex-col items-center px-2 py-3',
        BACKGROUND_COLOR[rating]
      )}
    >
      <Seal />
      <span className="my-1 font-bold">{transformedRating}</span>
      <span className="text-sm">
        Meets {metQualityStandards}/{totalQualityStandards} Quality Standards
      </span>
    </div>
  );
}
