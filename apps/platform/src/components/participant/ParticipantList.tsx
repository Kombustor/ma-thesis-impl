import { Checkbox, Input, Select } from 'react-daisyui';

import CrudList from '@/components/crud/CrudList';

import { InferQueryOutput } from '@mbg/api-platform/lib/trpc';
import { FeedbackMechanism } from '@mbg/api-platform/models/enums';
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
        source: {
          label: 'Source',
          component: ({ register }) => <Input disabled {...register()} />,
        },
        profileId: {
          label: 'ProfileID',
          component: ({ register }) => <Input required {...register()} />,
        },
        sessionId: {
          label: 'SessionID',
          component: ({ register }) => <Input required {...register()} />,
        },
        attentionCheckFailures: {
          label: 'Attention Check Failures',
          component: ({ register }) => (
            <Input type="number" required {...register()} />
          ),
        },
        dataUsableForResearch: {
          label: 'Data Usable For Research',
          component: ({ register }) => <Checkbox required {...register()} />,
        },
        dataProcessingConsent: {
          label: 'Data Processing Consent',
          component: ({ register }) => <Checkbox required {...register()} />,
        },
        feedbackMechanism: {
          label: 'Feedback Mechanism',
          component: ({ register }) => (
            <Select required {...register()}>
              {Object.entries(FeedbackMechanism).map(([key, value]) => (
                <Select.Option value={value}>{key}</Select.Option>
              ))}
            </Select>
          ),
        },
        articleProgress: {
          label: 'Article Progress',
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
          accessorKey: 'source',
          header: 'Source',
        },
        {
          accessorKey: 'profileId',
          header: 'PID',
        },
        {
          accessorKey: 'sessionId',
          header: 'SessionID',
        },
        {
          accessorKey: 'attentionCheckFailures',
          header: 'Attention Check Failures',
        },
        {
          accessorKey: 'articleProgress',
          header: 'Article Progress',
        },
        {
          accessorKey: 'attentionCheckFailures',
          header: 'Attention Check Failures',
        },
        {
          accessorKey: 'dataUsableForResearch',
          header: 'Data Usable For Research',
        },
        { accessorKey: 'feedbackMechanism', header: 'Feedback Mechanism' },
      ]}
    />
  );
}
