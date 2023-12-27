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

type MovieIdAndTitle = {
  id: number;
  title: string;
};

type AllMovies = {
  dicc_arr: MovieIdAndTitle[];
};

export type {
  AllMovies,
  CastInfo,
  MovieData,
  MovieIdAndTitle,
  MovieInfo,
  TrendingInfo,
};
