import { LoaderFunctionArgs, defer } from '@remix-run/node';
import SentimentPieChart from '~/components/visualization/sentiment-pie-chart';

const data = [
  { name: 'Positive', value: 69, fill: '#9E1953' },
  { name: 'Negative', value: 31, fill: '#F0F0F4' },
];

// export async function loader({ params }: LoaderFunctionArgs) {
//   return defer({});
// }

export default function MovieReviewsWithId() {
  return <SentimentPieChart data={data} />;
}
