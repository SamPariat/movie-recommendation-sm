import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  defer,
  json,
  redirect,
} from '@remix-run/node';
import { Await, MetaFunction, useLoaderData } from '@remix-run/react';
import { AxiosError } from 'axios';
import { Suspense } from 'react';
import { getValidatedFormData } from 'remix-hook-form';

import {
  getReviews,
  getSentimentData,
  refreshToken,
  saveReview,
} from '~/api';
import { MovieReviewForm } from '~/components/forms';
import { UserReviewsTable } from '~/components/tables';
import { SentimentBarChart } from '~/components/visualization';
import { getSession } from '~/sessions';
import { reviewFormSchema } from '~/types';

export const meta: MetaFunction<typeof loader> = ({ params }) => {
  return [
    {
      title: `CineSuggest | Reviews - ${params.movieId}`,
    },
    {
      name: 'description',
      content:
        'All your reviews along with the sentiment powered by our model',
    },
  ];
};

export async function action({
  params,
  request,
}: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (!session) {
    return redirect('/login');
  }

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData(
    request,
    zodResolver(reviewFormSchema)
  );

  if (errors) {
    return json({
      errors,
      defaultValues,
    });
  }

  const review: string = data.review;

  try {
    const savedReview = await saveReview(
      params.movieId as string,
      review as string,
      session.get('access_token')!
    );

    return json({
      savedReview,
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        const tokens = await refreshToken(
          session.get('refresh_token')!
        );

        session.set('access_token', tokens.access_token);
        session.set('refresh_token', tokens.refresh_token);

        const savedReview = await saveReview(
          params.movieId as string,
          review as string,
          tokens.access_token
        );

        return json({
          savedReview,
        });
      }
    }

    throw json({
      error,
    });
  }
}

export async function loader({ params }: LoaderFunctionArgs) {
  const sentimentData = getSentimentData(params.movieId as string);
  const reviews = getReviews(params.movieId as string);

  return defer({
    sentimentData,
    reviews,
  });
}

export default function MovieReviewsWithId() {
  const { sentimentData, reviews } = useLoaderData<typeof loader>();

  return (
    <div className='flex flex-col my-4'>
      <h1 className='font-bold text-4xl sm:text-6xl lg:text-7xl xl:text-8xl mb-8'>
        Reviews
      </h1>
      <h3 className='font-bold text-xl sm:text-3xl lg:text-4xl xl:text-5xl my-2'>
        Review Analytics
      </h3>
      <div className='my-8 h-96'>
        <Suspense
          fallback={
            <h5 className='text-xl font-medium m-auto my-4'>
              Loading review analytics....
            </h5>
          }
        >
          <Await resolve={sentimentData}>
            {(sentimentData) => (
              <SentimentBarChart data={sentimentData} />
            )}
          </Await>
        </Suspense>
      </div>
      <div className='font-bold text-xl sm:text-3xl lg:text-4xl xl:text-5xl my-2'>
        <h3>User Reviews</h3>
      </div>
      <Suspense
        fallback={
          <h5 className='text-xl font-medium m-auto my-4'>
            Loading reviews....
          </h5>
        }
      >
        <Await resolve={reviews}>
          {(reviews) => (
            <div className='my-8'>
              <UserReviewsTable data={reviews} />
            </div>
          )}
        </Await>
      </Suspense>
      <div className='flex flex-col my-4'>
        <MovieReviewForm />
      </div>
    </div>
  );
}
