import { LoaderFunctionArgs, defer } from '@remix-run/node';
import { MetaFunction } from '@remix-run/react';

import { SentimentPieChart } from '~/components/visualization';

const data = [
  { name: 'Positive', value: 69, fill: '#9E1953' },
  { name: 'Negative', value: 31, fill: '#F0F0F4' },
];

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

export async function loader({ params }: LoaderFunctionArgs) {
  return defer({});
}

export default function MovieReviewsWithId() {
  return <SentimentPieChart data={data} />;
}
