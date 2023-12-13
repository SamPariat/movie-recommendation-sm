import { useNavigate } from '@remix-run/react';
import {
  Table as TanstackTable,
  flexRender,
} from '@tanstack/react-table';

import { IMovieIdAndTitle } from '~/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

type AllMoviesRenderedTableProps = {
  table: TanstackTable<IMovieIdAndTitle>;
};

export default function AllMoviesRenderedTable({
  table,
}: AllMoviesRenderedTableProps) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className='cursor-pointer'
                onClick={() =>
                  navigate(`${row.original.title}`, {
                    state: {
                      id: row.original.id,
                    },
                  })
                }
              >
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
