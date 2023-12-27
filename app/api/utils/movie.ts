import {
  AllMovies,
  CastInfo,
  MovieIdAndTitle,
  MovieInfo,
  TrendingInfo,
} from '~/types';
import request from '..';

const getLatestTrending = async (): Promise<TrendingInfo> => {
  const latestTrending = await request<{
    latestTrending: TrendingInfo;
  }>('get', '/movie/latest-trending');

  return latestTrending.data.latestTrending;
};

const getTop5Trending = async (): Promise<TrendingInfo[]> => {
  const top5TrendingData = await request<{
    top5Trending: TrendingInfo[];
  }>('get', '/movie/top-5-trending');

  return top5TrendingData.data.top5Trending;
};

const getMovieCast = async (movieId: string): Promise<CastInfo> => {
  const movieCast = await request<CastInfo>('get', '/movie/cast', {
    id: movieId,
  });

  return movieCast.data;
};

const getAll = async (): Promise<MovieIdAndTitle[]> => {
  const allMovies = await request<AllMovies>('get', '/movie/all');

  return allMovies.data.dicc_arr;
};

const getInfo = async (movieId: string): Promise<MovieInfo> => {
  const movieInfo = await request<MovieInfo>('get', '/movie/info', {
    id: movieId,
  });

  return movieInfo.data;
};

const getRecommendations = async (
  movieTitle: string
): Promise<MovieInfo[]> => {
  const response = await request<{ recommendations: MovieInfo[] }>(
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
