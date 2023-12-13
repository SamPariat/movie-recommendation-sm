import { LoaderFunctionArgs, defer } from '@remix-run/node';
import {
  Await,
  Link,
  useLoaderData,
  useLocation,
  useParams,
} from '@remix-run/react';
import { Suspense } from 'react';

import { getRecommendations } from '~/api';
import MovieCard from '~/components/cards/movie-card';
import MovieSkeleton from '~/components/cards/movie-skeleton';
import DescriptionWithImage from '~/components/hero/description-with-image';

const skeletonId: { id: string }[] = [
  { id: 'movie-skeleton-1' },
  { id: 'movie-skeleton-2' },
  { id: 'movie-skeleton-3' },
  { id: 'movie-skeleton-4' },
  { id: 'movie-skeleton-5' },
];

export async function loader({ params }: LoaderFunctionArgs) {
  const recommendations = getRecommendations(
    params.movieTitle as string
  );

  return defer({
    recommendations,
  });
}

export default function RecommendWithMovieTitle() {
  const { recommendations } = useLoaderData<typeof loader>();
  const params = useParams();
  const location = useLocation();

  return (
    <div className='flex flex-col my-4'>
      <DescriptionWithImage
        src='/images/recommendation-3d.png'
        alt='Recommendation.png'
        description='The recommendations rely on the magnitude of cosine
        similarity scores, which are determined through a meticulous
        examination of movie descriptions. These scores gauge the
        likeness present in the narrative content, contributing to a
        robust and nuanced system for suggesting movies based on
        textual commonalities.'
        title='Before moving on...'
      />
      <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold mb-8'>
        This is what we recommend for{' '}
        <Link
          className='underline underline-offset-4 cursor-pointer'
          to={`/movie/${location.state.id}`}
          prefetch='intent'
        >
          {params.movieTitle}
        </Link>
      </h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-5 items-center'>
        <Suspense
          fallback={skeletonId.map(({ id }) => (
            <MovieSkeleton key={id} />
          ))}
        >
          <Await resolve={recommendations}>
            {(recommendations) =>
              recommendations.map((recommendation) => (
                <MovieCard
                  key={recommendation.id}
                  adult={recommendation.adult}
                  genres={recommendation.genres}
                  id={recommendation.id}
                  imagePath={recommendation.imagePath}
                  tagline={recommendation.tagline}
                  title={recommendation.title}
                />
              ))
            }
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
