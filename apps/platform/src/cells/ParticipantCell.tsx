import React from 'react';

import { Cell } from '@/cells/Cell';
import ParticipantList from '@/components/participant/ParticipantList';

export default function ParticipantCell() {
  return (
    <Cell
      query={['admin-participant.find-many']}
      Success={({ data }) => <ParticipantList data={data} />}
    />
  );
}
