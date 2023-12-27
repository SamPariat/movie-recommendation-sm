import { MovieReviews } from '@prisma/client';

type MovieReviewWithUser = MovieReviews & {
  movieUser: {
    name: string;
  };
};

export type { MovieReviewWithUser };
