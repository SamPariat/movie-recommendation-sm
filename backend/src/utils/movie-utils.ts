import axios, { AxiosError } from "axios";

import { ErrorMessages } from "../constants";
import {
  ErrorFetchingMovieInformation,
  InvalidMovieIdError,
  MovieDoesNotExistError,
  UnauthorizedError,
} from "../errors";
import { type CastInfo, type MovieInfo, type TrendingInfo } from "../types";

export const getMovieInformationById = async (
  movieId: number
): Promise<MovieInfo | null> => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        headers: {
          Authorization: "Bearer " + process.env.TMDB_API_KEY,
          Accept: "application/json",
        },
      }
    );

    const movieData = response.data;

    return {
      title: movieData.original_title,
      adult: movieData.adult,
      imagePath: "https://image.tmdb.org/t/p/w185" + movieData.poster_path,
      tagline: movieData.tagline,
      overview: movieData.overview,
    };
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 401) {
        throw new UnauthorizedError(ErrorMessages.Unauthorized);
      } else if (e.response?.status === 404) {
        if (e.response?.data.status_code === 6) {
          throw new InvalidMovieIdError(ErrorMessages.InvalidMovieId);
        } else if (e.response?.data.status_code === 34) {
          throw new MovieDoesNotExistError(ErrorMessages.MovieDoesNotExist);
        }
      } else if (e.message === ErrorMessages.InvalidMovieId) {
        throw new InvalidMovieIdError(ErrorMessages.InvalidMovieId);
      } else {
        throw new ErrorFetchingMovieInformation(
          ErrorMessages.ErrorFetchingMovieInformation
        );
      }
    }
    return null;
  }
};

export const getMovieCastById = async (
  movieId: number
): Promise<CastInfo | null> => {
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

    if (response.data["status"] === 34) {
      throw new MovieDoesNotExistError(ErrorMessages.MovieDoesNotExist);
    }

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
        imagePath: "https://image.tmdb.org/t/p/w185" + cast[i].profile_path,
      });
    }

    for (const crewMember of crew) {
      if (crewMember.job === "Director") {
        castInfo.director.push({
          name: crewMember.name,
          imagePath:
            "https://image.tmdb.org/t/p/w185" + crewMember.profile_path,
        });
        break;
      }
    }

    return castInfo;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new ErrorFetchingMovieInformation(
        ErrorMessages.ErrorFetchingMovieInformation
      );
    }
    return null;
  }
};

export const getTop5Trending = async (): Promise<TrendingInfo[] | null> => {
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

    for (let i = 1; i <= 5; i++) {
      trendingMovies.push({
        id: results[i].id,
        adult: results[i].adult,
        imagePath: "https://image.tmdb.org/t/p/w500" + results[i].poster_path,
        title: results[i].original_title,
        tagline: results[i].overview,
      });
    }

    return trendingMovies;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new ErrorFetchingMovieInformation(
        ErrorMessages.ErrorFetchingMovieInformation
      );
    }
    return null;
  }
};

export const getLatestTrendingMovie =
  async (): Promise<TrendingInfo | null> => {
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

      const latest: TrendingInfo = {
        id: results[0].id,
        adult: results[0].adult,
        imagePath: "https://image.tmdb.org/t/p/w500" + results[0].poster_path,
        title: results[0].original_title,
        tagline: results[0].overview,
      };

      return latest;
    } catch (e) {
      if (e instanceof AxiosError) {
        throw new ErrorFetchingMovieInformation(
          ErrorMessages.ErrorFetchingMovieInformation
        );
      }
      return null;
    }
  };
