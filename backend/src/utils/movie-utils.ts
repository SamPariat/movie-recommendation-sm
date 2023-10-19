import axios, { AxiosError } from "axios";

import {
  ERROR_FETCHING_MOVIE_INFORMATION,
  MOVIE_DOES_NOT_EXIST,
} from "../constants";

interface CommonDetails {
  imagePath: string;
}

export interface MovieInfo extends CommonDetails {
  adult: boolean;
  tagline: string;
  overview: string;
}

interface PersonInfo extends CommonDetails {
  name: string;
  character: string;
}

export interface CastInfo {
  actors: PersonInfo[];
  director: Omit<PersonInfo, "character">[];
}

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

    if (response.data["status_code"] === 34) {
      throw new AxiosError(MOVIE_DOES_NOT_EXIST);
    }

    const movieData = response.data;

    return {
      adult: movieData["adult"],
      imagePath: "https://image.tmdb.org/t/p/w185" + movieData["poster_path"],
      tagline: movieData["tagline"],
      overview: movieData["overview"],
    };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw new AxiosError(ERROR_FETCHING_MOVIE_INFORMATION);
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
      throw new AxiosError(MOVIE_DOES_NOT_EXIST);
    }

    const cast = response.data.cast;
    const crew = response.data.crew;
    const castInfo: CastInfo = {
      actors: [],
      director: [],
    };

    for (let i = 0; i < 4; i++) {
      castInfo.actors?.push({
        name: cast[i]["original_name"],
        character: cast[i]["character"],
        imagePath: "https://image.tmdb.org/t/p/w185" + cast[i]["profile_path"],
      });
    }

    for (const crewMember of crew) {
      if (crewMember["job"] === "Director") {
        castInfo.director.push({
          name: crewMember["name"],
          imagePath:
            "https://image.tmdb.org/t/p/w185" + crewMember["profile_path"],
        });
        break;
      }
    }

    return castInfo;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw new AxiosError(ERROR_FETCHING_MOVIE_INFORMATION);
    }
    return null;
  }
};
