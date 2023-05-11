import TopTenList from '@/components/data/Stats/Content/TopTenList';
import SubSubsection from '@/components/data/Stats/SubSubsection';
import Subsection from '@/components/data/Stats/Subsection';

import { InferQueryOutput } from '@mbg/api-platform/lib/trpc';

export default function Content({
  contentStats: { topTenLeastFeedback, topTenMostFeedback },
}: Pick<InferQueryOutput<'stats.get'>, 'contentStats'>) {
  return (
    <Subsection title="Content Stats">
      <SubSubsection title="Content with most amount feedback">
        <TopTenList data={topTenMostFeedback} />
      </SubSubsection>
      <SubSubsection title="Content with least amount of feedback">
        <TopTenList data={topTenLeastFeedback} />
      </SubSubsection>
    </Subsection>
  );
}
