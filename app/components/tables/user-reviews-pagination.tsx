import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Review } from '~/types';
import { Button } from '../ui/button';

type UserReviewsPaginationProps = {
  table: Table<Review>;
};

export function UserReviewsPagination({
  table,
}: UserReviewsPaginationProps) {
  return (
    <div className='flex justify-around'>
      <Button
        variant='outline'
        size='sm'
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft size={12} className='mr-2' />
        Previous
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
        <ChevronRight size={12} className='ml-2' />
      </Button>
    </div>
  );
}
