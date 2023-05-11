import Content from '@/components/data/Stats/Content';
import Participant from '@/components/data/Stats/Participant';

import { InferQueryOutput } from '@mbg/api-platform/lib/trpc';

type Props = {
  data: InferQueryOutput<'stats.get'>;
};

export default function Stats({ data }: Props) {
  return (
    <div className="mx-auto flex w-3/4 grow flex-col content-center gap-4 overflow-auto">
      <Participant {...data} />
      <Content {...data} />
    </div>
  );
}
