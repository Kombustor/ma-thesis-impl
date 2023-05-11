import React from 'react';

import { Cell } from '@/cells/Cell';
import ProlificCompletionCodeList from '@/components/prolific-completion-code/ProlificCompletionCodeList';

export default function ProlificCompletionCodeCell() {
  return (
    <Cell
      query={['prolific-completion-code.find-many']}
      Success={({ data }) => <ProlificCompletionCodeList data={data} />}
    />
  );
}
