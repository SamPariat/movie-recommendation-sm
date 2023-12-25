type CommonDetails = {
  imagePath: string;
};

type MovieCommonDetails = CommonDetails & {
  id: number;
  adult: boolean;
  tagline: string;
  genres: string[];
  releaseDate: string;
};

type MovieInfo = MovieCommonDetails & {
  overview: string;
  title: string;
};

type PersonInfo = CommonDetails & {
  name: string;
  character: string;
};

type CastInfo = {
  actors: PersonInfo[];
  director: Omit<PersonInfo, 'character'>[];
};

type TrendingInfo = MovieCommonDetails & {
  title: string;
};

type MovieData = MovieInfo & {
  title: string;
};

type AllMovies = {
  dicc_arr: {
    id: number;
    title: string;
  }[];
};

export type {
  AllMovies,
  CastInfo,
  MovieData,
  MovieInfo,
  PersonInfo,
  TrendingInfo,
};
