import axios, { AxiosError } from "axios";

import { ErrorMessages } from "../constants";
import {
  ErrorFetchingCast,
  ErrorFetchingMovieInformation,
  ErrorFetchingTrendingInfo,
  MovieDoesNotExistError,
  UnauthorizedError,
} from "../errors";
import {
  type CastInfo,
  type MovieInfo,
  type TmdbError,
  type TrendingInfo,
} from "../types";

const getGenreObject = async (): Promise<Record<number, string>> => {
  const response = await axios.get<{
    genres: { id: number; name: string }[];
  }>(`https://api.themoviedb.org/3/genre/movie/list`, {
    headers: {
      Authorization: "Bearer " + process.env.TMDB_API_KEY,
      Accept: "application/json",
    },
  });

  const { genres } = response.data;

  const genresObject: Record<number, string> = {};

  genres.forEach((genre) => (genresObject[genre.id] = genre.name));

  return genresObject;
};

export const getMovieInformationById = async (
  movieId: number
): Promise<MovieInfo> => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      {
        headers: {
          Authorization: "Bearer " + process.env.TMDB_API_KEY,
          Accept: "application/json",
        },
      }
    );

    const movieData = response.data;

    return {
      id: movieData.id,
      title: movieData.original_title,
      adult: movieData.adult,
      imagePath: "https://image.tmdb.org/t/p/w500" + movieData.poster_path,
      tagline: movieData.tagline,
      overview: movieData.overview,
      genres: movieData.genres.map(
        (genre: { id: number; name: string }) => genre.name
      ),
      releaseDate: movieData.release_date,
    };
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 401) {
        throw new UnauthorizedError(ErrorMessages.Unauthorized);
      } else if (e.response?.status === 404) {
        if ((e.response.data as TmdbError).status_code === 6) {
          throw new MovieDoesNotExistError(ErrorMessages.InvalidMovieId);
        } else if ((e.response.data as TmdbError).status_code === 34) {
          throw new MovieDoesNotExistError(ErrorMessages.MovieDoesNotExist);
        }
      } else {
        throw new ErrorFetchingMovieInformation(
          ErrorMessages.ErrorFetchingMovieInformation
        );
      }
    }

    throw e;
  }
};

export const getMovieCastById = async (movieId: number): Promise<CastInfo> => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits`,
      {
        headers: {
          Authorization: "Bearer " + process.env.TMDB_API_KEY,
          Accept: "application/json",
        },
      }
    );

    const cast = response.data.cast;
    const crew = response.data.crew;
    const castInfo: CastInfo = {
      actors: [],
      director: [],
    };

    for (let i = 0; i < 4; i++) {
      castInfo.actors?.push({
        name: cast[i].original_name,
        character: cast[i].character,
        imagePath: "https://image.tmdb.org/t/p/w500" + cast[i].profile_path,
      });
    }

    for (const crewMember of crew) {
      if (crewMember.job === "Director") {
        castInfo.director.push({
          name: crewMember.name,
          imagePath:
            "https://image.tmdb.org/t/p/w500" + crewMember.profile_path,
        });
        break;
      }
    }

    return castInfo;
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 401) {
        throw new UnauthorizedError(ErrorMessages.Unauthorized);
      } else if (e.response?.status === 404) {
        if ((e.response.data as TmdbError).status_code === 6) {
          throw new MovieDoesNotExistError(ErrorMessages.InvalidMovieId);
        } else if ((e.response.data as TmdbError).status_code === 34) {
          throw new MovieDoesNotExistError(ErrorMessages.MovieDoesNotExist);
        }
      } else {
        throw new ErrorFetchingCast(ErrorMessages.ErrorFetchingCastInformation);
      }
    }

    throw e;
  }
};

export const getTop5Trending = async (): Promise<TrendingInfo[]> => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
      {
        headers: {
          Authorization: "Bearer " + process.env.TMDB_API_KEY,
          Accept: "application/json",
        },
      }
    );

    const results = response.data.results;
    const trendingMovies: TrendingInfo[] = [];

    const genresObject = await getGenreObject();

    for (let i = 1; i <= 5; i++) {
      trendingMovies.push({
        id: results[i].id,
        adult: results[i].adult,
        imagePath: "https://image.tmdb.org/t/p/w500" + results[i].poster_path,
        title: results[i].original_title,
        tagline: results[i].overview,
        genres: results[i].genre_ids.map((id: number) => genresObject[id]),
        releaseDate: results[i].release_date,
      });
    }

    return trendingMovies;
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 401) {
        throw new UnauthorizedError(ErrorMessages.Unauthorized);
      } else if (e.response?.status === 404) {
        if ((e.response.data as TmdbError).status_code === 6) {
          throw new MovieDoesNotExistError(ErrorMessages.InvalidMovieId);
        } else if ((e.response.data as TmdbError).status_code === 34) {
          throw new MovieDoesNotExistError(ErrorMessages.MovieDoesNotExist);
        }
      } else {
        throw new ErrorFetchingTrendingInfo(
          ErrorMessages.ErrorFetchingTrendingMovies
        );
      }
    }

    throw e;
  }
};

export const getLatestTrendingMovie = async (): Promise<TrendingInfo> => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
      {
        headers: {
          Authorization: "Bearer " + process.env.TMDB_API_KEY,
          Accept: "application/json",
        },
      }
    );

    const results = response.data.results;

    const genresObject = await getGenreObject();

    const latest: TrendingInfo = {
      id: results[0].id,
      adult: results[0].adult,
      imagePath: "https://image.tmdb.org/t/p/w1280" + results[0].poster_path,
      title: results[0].original_title,
      tagline: results[0].overview,
      genres: results[0].genre_ids.map((id: number) => genresObject[id]),
      releaseDate: results[0].release_date,
    };

    return latest;
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 401) {
        throw new UnauthorizedError(ErrorMessages.Unauthorized);
      } else if (e.response?.status === 404) {
        if ((e.response.data as TmdbError).status_code === 6) {
          throw new MovieDoesNotExistError(ErrorMessages.InvalidMovieId);
        } else if ((e.response.data as TmdbError).status_code === 34) {
          throw new MovieDoesNotExistError(ErrorMessages.MovieDoesNotExist);
        }
      } else {
        throw new ErrorFetchingMovieInformation(
          ErrorMessages.ErrorFetchingTrendingInformation
        );
      }
    }

    throw e;
  }
};
