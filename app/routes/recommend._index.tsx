import { LoaderFunctionArgs, defer } from '@remix-run/node';
import { Await, MetaFunction, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';

import { getAll } from '~/api';
import AllMovieTable from '~/components/tables/all-movies-table';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'CineSuggest | Recommend',
    },
    {
      name: 'description',
      content:
        'Allow us to recommend a movie for you powered by our model',
    },
  ];
};

export async function loader({}: LoaderFunctionArgs) {
  const allMovies = getAll();

  return defer({
    allMovies,
  });
}

export default function Recommend() {
  const { allMovies } = useLoaderData<typeof loader>();

  return (
    <div className='flex flex-col'>
      <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold mb-4'>
        Find Similar Movies
      </h1>

      <h4 className='text-3xl md:text-4xl lg:text-5xl font-semibold my-8'>
        Uncover similar movies crafted just for you with this feature
        - Where entertainment meets creative recommendations!
      </h4>

      <Suspense
        fallback={
          <h5 className='text-xl font-medium m-auto my-4'>
            Loading the movies....
          </h5>
        }
      >
        <Await resolve={allMovies}>
          {(allMovies) => <AllMovieTable data={allMovies} />}
        </Await>
      </Suspense>
    </div>
  );
}
