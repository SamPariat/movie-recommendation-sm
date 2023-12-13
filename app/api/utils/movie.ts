import {
  IAllMovies,
  ICastInfo,
  IMovieIdAndTitle,
  IMovieInfo,
  ITrendingInfo,
} from '~/types';
import request from '..';

const getLatestTrending = async (): Promise<ITrendingInfo> => {
  const latestTrending = await request<ITrendingInfo>(
    'get',
    '/movie/latest-trending'
  );

  return latestTrending.data;
};

const getTop5Trending = async (): Promise<ITrendingInfo[]> => {
  const top5TrendingData = await request<{
    top5Trending: ITrendingInfo[];
  }>('get', '/movie/top-5-trending');

  return top5TrendingData.data.top5Trending;
};

const getMovieCast = async (movieId: number): Promise<ICastInfo> => {
  const movieCast = await request<ICastInfo>('get', '/movie/cast', {
    id: movieId,
  });

  return movieCast.data;
};

const getAll = async (): Promise<IMovieIdAndTitle[]> => {
  const allMovies = await request<IAllMovies>('get', '/movie/all');

  return allMovies.data.dicc_arr;
};

const getInfo = async (movieId: number): Promise<IMovieInfo> => {
  const movieInfo = await request<IMovieInfo>('get', '/movie/info', {
    id: movieId,
  });

  return movieInfo.data;
};

const getRecommendations = async (
  movieTitle: string
): Promise<IMovieInfo[]> => {
  const response = await request<{ recommendations: IMovieInfo[] }>(
    'get',
    '/model/recommendation',
    {
      movie: movieTitle,
    }
  );

  return response.data.recommendations;
};

export {
  getAll,
  getInfo,
  getLatestTrending,
  getMovieCast,
  getRecommendations,
  getTop5Trending,
};
