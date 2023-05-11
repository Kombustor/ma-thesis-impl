import { useState } from 'react';
import { Table } from 'react-daisyui';

import { InferQueryOutput } from '@mbg/api-platform/lib/trpc';
import { classNames } from '@mbg/ui';

type Props = {
  data: InferQueryOutput<'stats.get'>['contentStats']['topTenLeastFeedback'];
};

export default function TopTenList({ data }: Props) {
  const [selectedRowIdx, setSelectedRowIdx] = useState<number>();
  return (
    <Table className="w-full table-fixed">
      <Table.Head>
        <span>Rank</span>
        <span>Count</span>
        <span>Content</span>
      </Table.Head>
      <Table.Body>
        {Object.entries(data).map(([key, value], idx) => (
          <Table.Row
            key={key}
            onClick={() => {
              selectedRowIdx === idx
                ? // eslint-disable-next-line unicorn/no-useless-undefined
                  setSelectedRowIdx(undefined)
                : setSelectedRowIdx(idx);
            }}
          >
            <span>{idx + 1}</span>
            <span>{value.feedbackCount}</span>
            <span
              className={classNames(
                { 'line-clamp-2': idx !== selectedRowIdx },
                'whitespace-pre-wrap break-words'
              )}
            >
              {value.content}
            </span>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
