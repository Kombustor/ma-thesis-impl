import ListStandard from '@/components/misc/BiasLabel/ListStandard';
import { Hook, X } from '@/components/misc/BiasLabel/icons';

import { QualityStandards } from '@mbg/api-platform/schemas/article.schema';

export default function Reporting({
  source,
  credibleSource,
}: NonNullable<QualityStandards['reporting']>) {
  const Icon = credibleSource ? Hook : X;
  return (
    <ListStandard
      title="Reporting"
      items={[
        {
          text: 'Outlet',
          content: <span className="font-semibold">{source}</span>,
        },
        {
          text: 'Credible Outlet',
          content: <Icon className="mr-2 self-center" />,
        },
      ]}
    />
  );
}
