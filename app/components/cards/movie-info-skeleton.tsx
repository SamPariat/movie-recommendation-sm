import { Skeleton } from '../ui/skeleton';

export default function MovieInfoSkeleton() {
  return (
    <div className='flex flex-col'>
      <Skeleton className='h-[36px] md:h-[60px] w-56 my-2' />
      <span className='flex flex-row space-x-4 mb-4'>
        <Skeleton className='h-[16px] w-32' />
      </span>
      <span className='flex flex-row gap-2 mb-4'>
        <Skeleton className='h-6 w-20 rounded-full' />
        <Skeleton className='h-6 w-20 rounded-full' />
        <Skeleton className='h-6 w-20 rounded-full' />
      </span>
      <Skeleton className='h-[24px] md:h-[36px] w-44 mb-4' />
      <Skeleton className='h-[14px] md:h-[16px] max-w-2xl mb-2' />
      <Skeleton className='h-[14px] md:h-[16px] max-w-2xl mb-2' />
      <Skeleton className='h-[14px] md:h-[16px] max-w-2xl mb-2' />
    </div>
  );
}
