import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export function ActorDirectorSkeleton() {
  return (
    <div className='flex flex-col'>
      <Card>
        <CardHeader>
          <Skeleton className='h-[40px] w-[90px] md:w-[200px] m-auto' />
        </CardHeader>
        <CardContent className='w-fit m-auto'>
          <Skeleton className='h-[40px] w-[70px] lg:w-[100px] rounded-3xl' />
        </CardContent>
      </Card>
    </div>
  );
}
