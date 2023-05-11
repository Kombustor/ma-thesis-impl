import { Table } from 'react-daisyui';

import SubSubsection from '@/components/data/Stats/SubSubsection';
import Subsection from '@/components/data/Stats/Subsection';
import StatsTable from '@/components/data/Stats/Table';
import { PROGRESS_TO_LABEL } from '@/lib/progress-maps';

import { InferQueryOutput } from '@mbg/api-platform/lib/trpc';
import { StudyProgress } from '@mbg/api-platform/models/enums';
import { classNames } from '@mbg/ui';

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Participant({
  participantStats: {
    avgFeedbackCount,
    attentionCheckFailures: { totalFirstTime, totalSecondTime },
    feedbackMechanismDistribution,
    progressDistribution,
  },
}: Pick<InferQueryOutput<'stats.get'>, 'participantStats'>) {
  return (
    <Subsection title={'Participant stats'}>
      <StatsTable>
        <Table.Row>
          <span>Average amount of feedback per participant</span>
          <span>{avgFeedbackCount}</span>
        </Table.Row>
      </StatsTable>
      <SubSubsection title="Failures of attention checks">
        <StatsTable headings={['', '# Participants']}>
          {[
            ['First time', totalFirstTime],
            ['Second time', totalSecondTime],
          ].map(([key, value], idx) => (
            <Table.Row key={idx}>
              <span>{key}</span>
              <span>{value}</span>
            </Table.Row>
          ))}
        </StatsTable>
      </SubSubsection>
      <SubSubsection title="Distribution over feedback mechanisms">
        <StatsTable headings={['', '# Participants']}>
          {Object.entries(feedbackMechanismDistribution).map(([key, value]) => (
            <Table.Row key={key}>
              <span>{capitalizeFirstLetter(key.toLowerCase())}</span>
              <span>{value}</span>
            </Table.Row>
          ))}
        </StatsTable>
      </SubSubsection>
      <SubSubsection title="Progress Distribution">
        <StatsTable headings={['Step', '# Participants']}>
          {Object.entries(progressDistribution).map(([key, value]) => {
            const isTotal = !Object.keys(PROGRESS_TO_LABEL).includes(key);

            return (
              <tr
                key={key}
                className={classNames({
                  'border-t-2 border-black': isTotal,
                })}
              >
                <td>
                  {isTotal ? key : PROGRESS_TO_LABEL[key as StudyProgress]}
                </td>
                <td>{value}</td>
              </tr>
            );
          })}
        </StatsTable>
      </SubSubsection>
    </Subsection>
  );
}
