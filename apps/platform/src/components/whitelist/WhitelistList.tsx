import { Input } from 'react-daisyui';

import CrudList from '@/components/crud/CrudList';

import { InferQueryOutput } from '@mbg/api-platform/lib/trpc';
import {
  CreateEmailWhitelistSchema,
  UpdateEmailWhitelistSchema,
} from '@mbg/api-platform/schemas/whitelist.schema';

type Props = {
  data: InferQueryOutput<'whitelist.find-many'>;
};

export default function WhitelistList({ data }: Props) {
  return (
    <CrudList
      name="Whitelist"
      data={data}
      getId={(data) => data.id}
      formFields={{
        id: {
          label: 'ID',
          component: ({ register }) => <Input disabled {...register()} />,
        },
        name: {
          label: 'Name',
          component: ({ register }) => <Input required {...register()} />,
        },
        email: {
          label: 'Email',
          component: ({ register }) => <Input required {...register()} />,
        },
        createdAt: {
          label: 'Created at',
          component: ({ register }) => <Input disabled {...register()} />,
        },
      }}
      findManyOp={{
        query: 'whitelist.find-many',
      }}
      createOp={{
        mutation: 'whitelist.create',
        schema: CreateEmailWhitelistSchema,
      }}
      updateOp={{
        mutation: 'whitelist.update',
        schema: UpdateEmailWhitelistSchema,
      }}
      deleteOp={{
        mutation: 'whitelist.delete',
      }}
      columns={[
        {
          accessorKey: 'id',
          header: 'ID',
        },
        {
          accessorKey: 'name',
          header: 'Name',
        },
        {
          accessorKey: 'email',
          header: 'Email',
        },
      ]}
    />
  );
}
