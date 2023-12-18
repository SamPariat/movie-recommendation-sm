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

import { IMovieReview } from '~/types';
import { UserReviewsPagination, UserReviewsRenderedTable } from '.';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type UserReviewsTableProps = {
  data: IMovieReview[];
};

const columns: ColumnDef<IMovieReview>[] = [
  {
    accessorKey: 'sentiment',
    header: 'Sentiment',
  },
  {
    accessorKey: 'review',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          size='sm'
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          Review
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

export function UserReviewsTable({ data }: UserReviewsTableProps) {
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
        placeholder='Filter reviews...'
        value={
          (table.getColumn('review')?.getFilterValue() as string) ??
          ''
        }
        onChange={(event) =>
          table
            .getColumn('review')
            ?.setFilterValue(event.target.value)
        }
        className='m-auto max-w-md md:max-w-xl'
      />
      <div className='rounded-md border'>
        <UserReviewsRenderedTable table={table} />
      </div>
      <UserReviewsPagination table={table} />
    </div>
  );
}
