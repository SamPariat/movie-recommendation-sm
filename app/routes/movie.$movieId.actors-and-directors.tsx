import { LoaderFunctionArgs, defer } from '@remix-run/node';
import { Await, MetaFunction, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { getMovieCast } from '~/api';

import ActorDirectorCard from '~/components/cards/actor-director-card';
import ActorDirectorSkeleton from '~/components/cards/actor-director-skeleton';

export const meta: MetaFunction<typeof loader> = ({ params }) => {
  return [
    {
      title: `CineSuggest | Actors and Directors - ${params.movieId}`,
    },
    {
      name: 'description',
      content:
        'Discover the magic that unfolds behind and in front of the camera, as we celebrate the brilliance of those who make the movies unforgettable',
    },
  ];
};

const skeletonId: { id: string }[] = [
  { id: 'actor-skeleton-1' },
  { id: 'actor-skeleton-2' },
  { id: 'actor-skeleton-3' },
  { id: 'actor-skeleton-4' },
  { id: 'actor-skeleton-5' },
];

export async function loader({ params }: LoaderFunctionArgs) {
  const movieCast = getMovieCast(parseInt(params.movieId as string));

  return defer({
    movieCast,
  });
}

export default function ActorsAndDirectorsWithMovieId() {
  const { movieCast } = useLoaderData<typeof loader>();

  return (
    <div className='flex flex-col my-4'>
      <h1 className='font-bold text-4xl sm:text-6xl lg:text-7xl xl:text-8xl mb-8'>
        Actors
      </h1>
      <h2 className='font-semibold text-xl sm:text-3xl lg:text-4xl mb-4'>
        These skilled individuals breathe life into characters,
        infusing every scene with their distinct charisma and
        expertise. Committed to their craft and possessing a profound
        understanding of storytelling, creating moments that resonate
        long after the credits roll.
      </h2>
      <div className='my-8'>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          <Suspense
            fallback={skeletonId.map(({ id }) => (
              <ActorDirectorSkeleton key={id} />
            ))}
          >
            <Await resolve={movieCast}>
              {(movieCast) =>
                movieCast.actors.map((actor) => (
                  <ActorDirectorCard
                    key={actor.name}
                    imagePath={actor.imagePath}
                    name={actor.name}
                    role={actor.character}
                  />
                ))
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className='grid grid-cols-5 gap-4 items-center my-4'>
        <div className='col-span-5 sm:col-span-3'>
          <h1 className='font-bold text-4xl sm:text-6xl lg:text-7xl xl:text-8xl mb-8'>
            Director
          </h1>
          <h2 className='font-semibold text-xl sm:text-3xl lg:text-4xl mb-4'>
            With a keen eye for detail and an unwavering passion for
            storytelling, each frame comes to life under their
            guidance, delivering cinematic experiences that resonate
            with the audience. Immerse yourself in the unique
            perspectives of these talented directors and witness their
            artistry unfold on the screen.
          </h2>
        </div>
        <div className='col-span-5 sm:col-span-2'>
          <Suspense>
            <Await resolve={movieCast}>
              {(movieCast) => (
                <ActorDirectorCard
                  imagePath={movieCast.director[0].imagePath}
                  name={movieCast.director[0].name}
                  role='Director'
                />
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
