import { Input, Select } from 'react-daisyui';

import CrudList from '@/components/crud/CrudList';

import { InferQueryOutput } from '@mbg/api-platform/lib/trpc';
import { ProlificCompletionCodeEvent } from '@mbg/api-platform/models/enums';
import {
  CreateProlificCompletionCodeSchema,
  UpdateProlificCompletionCodeSchema,
} from '@mbg/api-platform/schemas/prolific-completion-code.schema';

type Props = {
  data: InferQueryOutput<'prolific-completion-code.find-many'>;
};

export default function ProlificCompletionCodeList({ data }: Props) {
  return (
    <CrudList
      name="Completion Codes"
      data={data}
      getId={(data) => data.id}
      formFields={{
        id: {
          label: 'ID',
          component: ({ register }) => <Input disabled {...register()} />,
        },
        event: {
          label: 'Event',
          component: ({ register }) => (
            <Select required {...register()}>
              {Object.entries(ProlificCompletionCodeEvent).map(
                ([key, value]) => (
                  <Select.Option value={value}>{key}</Select.Option>
                )
              )}
            </Select>
          ),
        },
        code: {
          label: 'Code',
          component: ({ register }) => <Input required {...register()} />,
        },
      }}
      findManyOp={{
        query: 'prolific-completion-code.find-many',
      }}
      createOp={{
        mutation: 'prolific-completion-code.create',
        schema: CreateProlificCompletionCodeSchema,
      }}
      updateOp={{
        mutation: 'prolific-completion-code.update',
        schema: UpdateProlificCompletionCodeSchema,
      }}
      deleteOp={{
        mutation: 'prolific-completion-code.delete',
      }}
      columns={[
        {
          accessorKey: 'id',
          header: 'ID',
        },
        {
          accessorKey: 'event',
          header: 'Event',
        },
        {
          accessorKey: 'code',
          header: 'Code',
        },
      ]}
    />
  );
}
