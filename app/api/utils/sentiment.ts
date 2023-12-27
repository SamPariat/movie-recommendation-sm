import { MovieReview } from '~/types';
import request from '..';

const getReviews = async (id: string): Promise<MovieReview[]> => {
  const response = await request<{ reviews: MovieReview[] }>(
    'get',
    `/sentiment/get-all-reviews/${id}`
  );

  return response.data.reviews;
};

const getSentimentData = async (
  id: string
): Promise<{ name: string; value: number }[]> => {
  const response = await request<{ name: string; value: number }[]>(
    'get',
    `/sentiment/review-analytics/${id}`
  );

  return response.data;
};

const saveReview = async (
  id: string,
  review: string,
  access_token: string
) => {
  const response = await request(
    'post',
    `/sentiment/save-review/${id}`,
    undefined,
    {
      review,
    },
    {
      Authorization: `Bearer ${access_token}`,
    }
  );

  return response.data;
};

export { getReviews, getSentimentData, saveReview };
