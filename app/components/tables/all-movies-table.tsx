import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDownWideNarrow, ArrowUp } from 'lucide-react';
import { useState } from 'react';

import { IMovieIdAndTitle } from '~/types';
import { AllMoviesPagination, AllMoviesRenderedTable } from '.';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type AllMovieTableProps = {
  data: IMovieIdAndTitle[];
};

const columns: ColumnDef<IMovieIdAndTitle>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          size='sm'
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          Title
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className='ml-2' size={12} />
          ) : (
            <ArrowDownWideNarrow className='ml-2' size={12} />
          )}
        </Button>
      );
    },
  },
];

export function AllMovieTable({ data }: AllMovieTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className='flex flex-col space-y-4 my-4'>
      <Input
        placeholder='Filter movies...'
        value={
          (table.getColumn('title')?.getFilterValue() as string) ?? ''
        }
        onChange={(event) =>
          table.getColumn('title')?.setFilterValue(event.target.value)
        }
        className='m-auto max-w-md md:max-w-xl'
      />
      <div className='rounded-md border'>
        <AllMoviesRenderedTable table={table} />
      </div>
      <AllMoviesPagination table={table} />
    </div>
  );
}
