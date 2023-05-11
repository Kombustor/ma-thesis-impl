import React from 'react';

import { Cell } from '@/cells/Cell';
import WhitelistList from '@/components/whitelist/WhitelistList';

export default function WhitelistCell() {
  return (
    <Cell
      query={['whitelist.find-many']}
      Success={({ data }) => <WhitelistList data={data} />}
    />
  );
}
