import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

import MutationForm, { FormFieldDef } from '@/components/crud/MutationForm';
import DeleteButton from '@/components/crud/utils/DeleteButton';
import PageHeader from '@/components/misc/PageHeader';

import {
  InferMutationInput,
  TMutation,
  TQuery,
  trpc,
} from '@mbg/api-platform/lib/trpc';
import type { MutationSchema } from '@mbg/api-platform/lib/trpc/crud-mutation';
import { DataTable } from '@mbg/ui';

type BaseProps<T, R> = {
  name: string;

  data: T[];
  columns: ColumnDef<T>[];

  getId: (data: T) => string;
  formFields: Record<keyof T, FormFieldDef>;

  findManyOp: {
    query: R;
  };

  headerAddons?: React.ReactNode;
};

type CreateProps<C> = {
  createOp: {
    mutation: C;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: MutationSchema<any>;
  };
};

type UpdateProps<U> = {
  updateOp: {
    mutation: U;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: MutationSchema<any>;
  };
};

type DeleteProps<D> = {
  deleteOp: {
    mutation: D;
  };
};

export default function CrudList<
  T extends object,
  R extends TQuery,
  C extends TMutation,
  U extends TMutation,
  D extends TMutation
>({
  name,
  data,
  findManyOp,
  createOp,
  updateOp,
  deleteOp,
  getId,
  formFields,
  columns,
  headerAddons,
}: BaseProps<T, R> &
  Partial<CreateProps<C>> &
  Partial<UpdateProps<U>> &
  Partial<DeleteProps<D>>) {
  const tctx = trpc.useContext();

  const invalidateData = React.useCallback(() => {
    tctx.invalidateQueries(findManyOp.query);
  }, [tctx, findManyOp]);

  const cols = React.useMemo(
    () => [
      ...columns,
      {
        id: 'actions',
        cell: (props) => (
          <div className="float-right flex flex-row gap-2">
            {updateOp && (
              <MutationForm
                name={name}
                mutationName={updateOp.mutation}
                schema={updateOp.schema}
                defaultValues={props.row.original as InferMutationInput<U>}
                existingId={getId(props.row.original)}
                onSuccess={invalidateData}
                formFields={formFields}
              />
            )}
            {deleteOp && (
              <DeleteButton
                mutationName={deleteOp.mutation}
                input={getId(props.row.original) as InferMutationInput<D>}
                onDelete={invalidateData}
              />
            )}
          </div>
        ),
      },
    ],
    [columns, invalidateData, deleteOp, updateOp, name, getId, formFields]
  );

  return (
    <>
      <PageHeader
        text={name}
        addons={
          <>
            {createOp && (
              <MutationForm
                name={name}
                mutationName={createOp.mutation}
                schema={createOp.schema}
                onSuccess={invalidateData}
                formFields={formFields}
              />
            )}
            {headerAddons}
          </>
        }
      />
      <DataTable columns={cols} data={data} />
    </>
  );
}
