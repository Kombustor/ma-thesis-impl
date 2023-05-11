import ListStandard from '@/components/misc/BiasLabel/ListStandard';
import { Hook, X } from '@/components/misc/BiasLabel/icons';

import { QualityStandards } from '@mbg/api-platform/schemas/article.schema';

export default function Objectivity({
  omitsOpinion,
}: NonNullable<QualityStandards['objectivity']>) {
  const Icon = omitsOpinion ? Hook : X;
  return (
    <ListStandard
      title="Objectivity"
      items={[
        {
          text: 'Omits Opinion',
          content: <Icon className="mr-2 self-center" />,
        },
      ]}
    />
  );
}
