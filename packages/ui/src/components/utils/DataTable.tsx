import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { ReactElement } from 'react';
import { Table } from 'react-daisyui';

interface Props<D extends object> {
  columns: ColumnDef<D>[];
  data?: D[];
}

export function DataTable<D extends object>({
  columns,
  data,
}: Props<D>): ReactElement {
  const table = useReactTable({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table className="w-full table-auto">
      {table.getHeaderGroups().map((headerGroup) => (
        <Table.Head key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <span key={header.id}>
              {header.isPlaceholder
                ? undefined
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </span>
          ))}
        </Table.Head>
      ))}
      <Table.Body>
        {table.getRowModel().rows.map((row) => (
          <Table.Row key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <span key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </span>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

// {
//   table.getFooterGroups().map(footerGroup => (
//     <Table.Footer key={footerGroup.id}>
//       {footerGroup.headers.map(header => (
//         <span key={header.id}>
//           {header.isPlaceholder
//             ? undefined
//             : flexRender(
//               header.column.columnDef.footer,
//               header.getContext()
//             )}
//         </span>
//       ))}
//     </Table.Footer>
//   ))
// }
