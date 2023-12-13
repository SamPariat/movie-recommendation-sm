import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export default function MovieSkeleton() {
  return (
    <div className='flex flex-col mx-0 md:mx-10 xl:mx-16 w-full md:w-3/4'>
      <Card>
        <CardHeader>
          <Skeleton className='h-[40px] md:h-[40px] w-[200px] md:w-[200px]' />
          <Skeleton className='h-[20px] w-[80px]' />
          <Skeleton className='h-[15px] w-[100px]' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-[25px] mb-2' />
          <Skeleton className='h-[25px] w-[120px] md:w-[150px]' />
        </CardContent>
        <CardFooter className='flex justify-around'>
          <Skeleton className='h-[30px] md:h-[30px] w-[100px] md:w-[90px]' />
          <Skeleton className='h-[30px] md:h-[30px] w-[100px] md:w-[90px]' />
        </CardFooter>
      </Card>
    </div>
  );
}
