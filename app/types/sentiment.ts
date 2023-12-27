type MovieReview = {
  id: string;
  review: string;
  sentiment: string;
  movie: string;
  movieuserId: string;
};

type MovieUser = {
  name: string;
};

type Review = {
  id: string;
  review: string;
  sentiment: string;
  movieId: number;
  movieUserId: string;
  movieUser: MovieUser;
} & MovieUser;

export type { MovieReview, Review };
