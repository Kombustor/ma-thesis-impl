import { Cell } from '@/cells/Cell';
import Stats from '@/components/data/Stats';

export default function StatsCell() {
  return (
    <Cell query={['stats.get']} Success={({ data }) => <Stats data={data} />} />
  );
}
