import { Table } from 'react-daisyui';

import SubSubsection from '@/components/data/Stats/SubSubsection';
import Subsection from '@/components/data/Stats/Subsection';
import StatsTable from '@/components/data/Stats/Table';

import { InferQueryOutput } from '@mbg/api-platform/lib/trpc';

export default function Time({
  timeStats: { average, percentiles },
}: Pick<InferQueryOutput<'stats.get'>, 'timeStats'>) {
  return (
    <Subsection title={'Time stats'}>
      <StatsTable>
        <Table.Row>
          <span>Average time spent</span>
          <span>{average}</span>
        </Table.Row>
      </StatsTable>
      <SubSubsection title="Percentiles">
        <StatsTable headings={['Percentile', 'Value']}>
          {Object.entries(percentiles).map(([key, value]) => (
            <Table.Row key={key}>
              <span>{key}</span>
              <span>{value}</span>
            </Table.Row>
          ))}
        </StatsTable>
      </SubSubsection>
    </Subsection>
  );
}
