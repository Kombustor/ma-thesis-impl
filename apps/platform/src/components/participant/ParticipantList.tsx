import { Checkbox, Input } from 'react-daisyui';

import CrudList from '@/components/crud/CrudList';

import { InferQueryOutput } from '@mbg/api-platform/lib/trpc';
import { UpdateParticipantSchema } from '@mbg/api-platform/schemas/participant.schema';

type Props = {
  data: InferQueryOutput<'admin-participant.find-many'>;
};

export default function ParticipantList({ data }: Props) {
  return (
    <CrudList
      name="Participants"
      data={data}
      getId={(data) => data.id}
      formFields={{
        id: {
          label: 'ID',
          component: ({ register }) => <Input disabled {...register()} />,
        },
        dataProcessingConsent: {
          label: 'Data Processing Consent',
          component: ({ register }) => <Checkbox required {...register()} />,
        },
        browserSignature: {
          label: 'Browser signature',
          component: ({ register }) => (
            <Input type="number" required {...register()} />
          ),
        },
        createdAt: {
          label: 'Created at',
          component: ({ register }) => <Input disabled {...register()} />,
        },
      }}
      findManyOp={{
        query: 'admin-participant.find-many',
      }}
      updateOp={{
        mutation: 'admin-participant.update',
        schema: UpdateParticipantSchema,
      }}
      deleteOp={{
        mutation: 'admin-participant.delete',
      }}
      columns={[
        {
          accessorKey: 'id',
          header: 'ID',
        },
        {
          accessorKey: 'browserSignature',
          header: 'Browser signature',
        },
        {
          accessorKey: 'dataProcessingConsent',
          header: 'Data processing consent',
        },
      ]}
    />
  );
}
