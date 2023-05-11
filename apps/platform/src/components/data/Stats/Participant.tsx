import { Table } from 'react-daisyui';

import Subsection from '@/components/data/Stats/Subsection';
import StatsTable from '@/components/data/Stats/Table';

import { InferQueryOutput } from '@mbg/api-platform/lib/trpc';

export default function Participant({
  participantStats: { avgFeedbackCount, medianFeedbackCount },
}: Pick<InferQueryOutput<'stats.get'>, 'participantStats'>) {
  return (
    <Subsection title={'Participant stats'}>
      <StatsTable>
        <Table.Row>
          <span>
            Mean amount of feedback per participant (filtered out participants
            with 0)
          </span>
          <span>{avgFeedbackCount}</span>
        </Table.Row>
        <Table.Row>
          <span>
            Median amount of feedback per participant (filtered out participants
            with 0)
          </span>
          <span>{medianFeedbackCount}</span>
        </Table.Row>
      </StatsTable>
    </Subsection>
  );
}
