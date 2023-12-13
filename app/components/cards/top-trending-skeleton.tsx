import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export default function TopTrendingSkeleton() {
  return (
    <div className='flex flex-col mx-0 md:mx-10 xl:mx-16'>
      <Card>
        <CardHeader>
          <Skeleton className='h-[40px] w-[200px] md:h-[40px] md:w-[500px]' />
          <Skeleton className='h-[20px] w-[80px]' />
          <Skeleton className='h-[15px] w-[100px]' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-[25px] mb-2' />
          <Skeleton className='h-[25px] w-[120px] md:w-[500px]' />
        </CardContent>
        <CardFooter className='flex justify-around'>
          <Skeleton className='h-[30px] md:h-[50px] w-[100px] md:w-[150px]' />
          <Skeleton className='h-[30px] md:h-[50px] w-[100px] md:w-[150px]' />
        </CardFooter>
      </Card>
    </div>
  );
}
