interface ICommonDetails {
  imagePath: string;
}

interface IMovieCommonDetails extends ICommonDetails {
  id: number;
  adult: boolean;
  tagline: string;
  genres: string[];
  releaseDate: string;
}

interface IMovieInfo extends IMovieCommonDetails {
  overview: string;
  title: string;
}

interface IPersonInfo extends ICommonDetails {
  name: string;
  character: string;
}

interface ICastInfo {
  actors: IPersonInfo[];
  director: Omit<IPersonInfo, 'character'>[];
}

interface ITrendingInfo extends IMovieCommonDetails {
  title: string;
}

interface IMovieData extends IMovieInfo {
  title: string;
}

interface IMovieIdAndTitle {
  id: number;
  title: string;
}

interface IAllMovies {
  dicc_arr: IMovieIdAndTitle[];
}

export type {
  IAllMovies,
  ICastInfo,
  IMovieData,
  IMovieIdAndTitle,
  IMovieInfo,
  ITrendingInfo,
};
