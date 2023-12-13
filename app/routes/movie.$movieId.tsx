import { LoaderFunctionArgs, defer } from '@remix-run/node';
import { Await, Outlet, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';

import { getInfo } from '~/api';
import MovieInfoCard from '~/components/cards/movie-info-card';
import MovieInfoSkeleton from '~/components/cards/movie-info-skeleton';

export async function loader({ params }: LoaderFunctionArgs) {
  const info = getInfo(parseInt(params.movieId as string));

  return defer({
    info,
  });
}

export default function MovieWithId() {
  const { info } = useLoaderData<typeof loader>();

  return (
    <>
      <div className='grid grid-cols-4 space-x-4 lg:space-x-8 items-center my-2'>
        <div className='col-span-4 md:col-span-1 lg:col-span-2'>
          <Suspense
            fallback={
              <p className='text-2xl font-semibold text-center'>
                Loading image...
              </p>
            }
          >
            <Await resolve={info}>
              {(info) => (
                <img
                  src={info.imagePath}
                  alt={info.title}
                  className='rounded-md object-cover m-auto'
                />
              )}
            </Await>
          </Suspense>
        </div>
        <div className='col-span-4 md:col-span-3 lg:col-span-2'>
          <Suspense fallback={<MovieInfoSkeleton />}>
            <Await resolve={info}>
              {(info) => <MovieInfoCard info={info} />}
            </Await>
          </Suspense>
        </div>
      </div>
      <Outlet />
    </>
  );
}
