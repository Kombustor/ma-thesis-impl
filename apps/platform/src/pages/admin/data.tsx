import Link from 'next/link';
import { Button } from 'react-daisyui';
import { HiDocumentDownload } from 'react-icons/hi';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { useQuery } from 'react-query';

import StatsCell from '@/cells/StatsCell';
import AdminLayout from '@/layouts/AdminLayout';

import { trpc } from '@mbg/api-platform/lib/trpc';

export default function DataPage() {
  const context = trpc.useContext();
  const { isFetching } = useQuery(['stats.get']);

  return (
    <AdminLayout>
      <StatsCell />
      <div className="flex justify-around p-5">
        <Link href="/api/data">
          <Button endIcon={<HiDocumentDownload />} className="w-1/4">
            Export Data
          </Button>
        </Link>
        <Button
          endIcon={<HiOutlineArrowPath />}
          className="w-1/4"
          onClick={() => {
            context.invalidateQueries('stats.get');
          }}
          disabled={isFetching}
          loading={isFetching}
        >
          Refresh
        </Button>
      </div>
    </AdminLayout>
  );
}
