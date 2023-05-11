import Divider from '@/components/misc/BiasLabel/Divider';
import Gauge from '@/components/misc/BiasLabel/Gauge';

import { QualityStandards } from '@mbg/api-platform/schemas/article.schema';

export default function BiasedLanguage(
  props: NonNullable<QualityStandards['language']>
) {
  return (
    <div>
      <div className="mb-1.5 flex flex-row items-center justify-between">
        <span className="text-md font-bold">Biased Language</span>
        <Gauge
          className="basis-28 lg:basis-[36%]"
          label={props.label}
          percentage={props.biasPercentage}
        />
      </div>
      <Divider small />
    </div>
  );
}
