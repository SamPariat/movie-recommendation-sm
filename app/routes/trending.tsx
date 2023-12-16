import {
  LoaderFunctionArgs,
  MetaFunction,
  defer,
} from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';

import { getLatestTrending, getTop5Trending } from '~/api';
import {
  MovieCard,
  MovieSkeleton,
  TopTrendingCard,
  TopTrendingSkeleton,
} from '~/components/cards';
import { TrendingDescription } from '~/components/hero';

export const meta: MetaFunction = () => {
  return [
    { title: 'CineSuggest | Trending' },
    {
      name: 'description',
      content:
        'Immerse yourself in the cinematic world with our collection of the hottest and highest trending movies',
    },
  ];
};

const skeletonId: { id: string }[] = [
  { id: 'movie-skeleton-1' },
  { id: 'movie-skeleton-2' },
  { id: 'movie-skeleton-3' },
  { id: 'movie-skeleton-4' },
  { id: 'movie-skeleton-5' },
];

export async function loader({}: LoaderFunctionArgs) {
  const latestTrending = getLatestTrending();

  const top5Trending = getTop5Trending();

  return defer({
    latestTrending,
    top5Trending,
  });
}

export default function Trending() {
  const { latestTrending, top5Trending } =
    useLoaderData<typeof loader>();

  return (
    <div className='flex flex-col mb-4'>
      <TrendingDescription />

      <h1 className='text-3xl sm:text-5xl lg:text-7xl font-semibold my-6'>
        Highest Trending Movie
      </h1>
      <Suspense fallback={<TopTrendingSkeleton />}>
        <Await resolve={latestTrending}>
          {(latestTrending) => (
            <TopTrendingCard
              id={latestTrending.id}
              adult={latestTrending.adult}
              genres={latestTrending.genres}
              imagePath={latestTrending.imagePath}
              tagline={latestTrending.tagline}
              title={latestTrending.title}
            />
          )}
        </Await>
      </Suspense>

      <h1 className='text-3xl sm:text-5xl lg:text-7xl font-semibold my-6'>
        More Trending Movies
      </h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-5'>
        <Suspense
          fallback={skeletonId.map(({ id }) => (
            <MovieSkeleton key={id} />
          ))}
        >
          <Await resolve={top5Trending}>
            {(top5Trending) => (
              <>
                {top5Trending.map((trending) => (
                  <MovieCard
                    key={trending.id}
                    id={trending.id}
                    adult={trending.adult}
                    imagePath={trending.imagePath}
                    tagline={trending.tagline}
                    title={trending.title}
                    genres={trending.genres}
                  />
                ))}
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
