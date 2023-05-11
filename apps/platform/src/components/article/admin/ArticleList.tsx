import { useRouter } from 'next/router';
import { Button, Checkbox, Input } from 'react-daisyui';
import { Controller } from 'react-hook-form';
import { HiEye, HiLink } from 'react-icons/hi';

import CrudList from '@/components/crud/CrudList';
import ModifyButton from '@/components/crud/utils/ModifyButton';
import { dateToDatetimeLocal, datetimeLocalToDate } from '@/lib/date';

import { InferQueryOutput } from '@mbg/api-platform/lib/trpc';
import { UpdateArticleSchema } from '@mbg/api-platform/schemas/article.schema';

type Props = {
  data: InferQueryOutput<'admin-article.find-many'>;
};

export default function ArticleList({ data }: Props) {
  const router = useRouter();

  return (
    <CrudList
      name="Articles"
      data={data}
      getId={(data) => data.id}
      formFields={{
        id: {
          label: 'ID',
          component: ({ register }) => <Input disabled {...register()} />,
        },
        inferenceAvailable: {
          label: 'Inference Available',
          component: ({ register }) => <Checkbox disabled {...register()} />,
        },
        title: {
          label: 'Title',
          component: ({ register }) => <Input required {...register()} />,
        },
        sitename: {
          label: 'Site Name',
          component: ({ register }) => <Input required {...register()} />,
        },
        author: {
          label: 'Author',
          component: ({ register }) => <Input required {...register()} />,
        },
        date: {
          label: 'Date (in local timezone)',
          component: ({ control }) => (
            <Controller
              {...control()}
              render={({ field }) => (
                <Input
                  required
                  type="datetime-local"
                  value={dateToDatetimeLocal(field.value)}
                  onChange={(e) =>
                    field.onChange(datetimeLocalToDate(e.target.value))
                  }
                />
              )}
            />
          ),
        },
        source: {
          label: 'Source',
          component: ({ register }) => <Input required {...register()} />,
        },
        indexInStudy: {
          label: 'Index in Study (0-indexed)',
          registerOptions: {
            // eslint-disable-next-line unicorn/no-null
            setValueAs: (v) => (v === '' ? null : Number.parseInt(v, 10)),
          },
          component: ({ register }) => (
            <Input type="number" min={0} {...register()} />
          ),
        },
        createdAt: {
          label: 'Created at',
          component: ({ register }) => <Input disabled {...register()} />,
        },
      }}
      findManyOp={{
        query: 'admin-article.find-many',
      }}
      updateOp={{
        mutation: 'admin-article.update',
        schema: UpdateArticleSchema,
      }}
      deleteOp={{
        mutation: 'admin-article.delete',
      }}
      headerAddons={
        <ModifyButton onClick={() => router.push('/admin/article/add')} />
      }
      columns={[
        {
          accessorKey: 'id',
          header: 'ID',
        },
        {
          header: 'Source',
          cell: ({ row }) => (
            <a target="_blank" rel="noreferrer" href={row.original.source}>
              <HiLink />
            </a>
          ),
        },
        {
          accessorKey: 'sitename',
          header: 'Site',
        },
        {
          header: 'Title',
          cell: ({ row }) => (
            <div
              title={row.original.title}
              className="max-w-md overflow-hidden text-ellipsis"
            >
              {row.original.title}
            </div>
          ),
        },
        {
          accessorKey: 'author',
          header: 'Author',
        },
        {
          accessorKey: 'date',
          header: 'Date',
        },
        {
          accessorKey: 'inferenceAvailable',
          header: 'Inference Available',
        },
        {
          accessorKey: 'indexInStudy',
          header: 'Index in Study',
        },
        {
          header: 'Content',
          cell: ({ row }) => (
            <Button
              color="primary"
              onClick={() =>
                router.push(
                  `/admin/article/edit-and-classify/${row.original.id}`
                )
              }
            >
              <HiEye />
            </Button>
          ),
        },
      ]}
    />
  );
}
