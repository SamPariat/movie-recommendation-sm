import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosRequestConfig } from 'axios';

import { ErrorMessages } from '../../constants';
import {
  ICastInfo,
  IMovieInfo,
  ITmdbError,
  ITrendingInfo,
} from '../types';

@Injectable()
export class MovieUtilsService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getGenresObject(): Promise<Record<number, string>> {
    const config = this.getConfig();

    const response = await this.httpService.axiosRef.get<{
      genres: { id: number; name: string }[];
    }>(
      `https://api.themoviedb.org/3/genre/movie/list`,
      config,
    );

    const { genres } = response.data;

    const genresObject: Record<number, string> = {};

    genres.forEach(
      (genre) => (genresObject[genre.id] = genre.name),
    );

    return genresObject;
  }

  async getMovieInformationById(
    movieId: number,
  ): Promise<IMovieInfo> {
    const config = this.getConfig();

    try {
      const response = await this.httpService.axiosRef.get(
        `https://api.themoviedb.org/3/movie/${movieId}`,
        config,
      );

      const movieData = response.data;

      return {
        id: movieData.id,
        title: movieData.original_title,
        adult: movieData.adult,
        imagePath:
          'https://image.tmdb.org/t/p/w500' +
          movieData.poster_path,
        tagline: movieData.tagline,
        overview: movieData.overview,
        genres: movieData.genres.map(
          (genre: { id: number; name: string }) =>
            genre.name,
        ),
        releaseDate: movieData.release_date,
      };
    } catch (error) {
      if (error instanceof AxiosError)
        this.handleError(error);

      throw error;
    }
  }

  async getMovieCastById(
    movieId: number,
  ): Promise<ICastInfo> {
    const config = this.getConfig();

    try {
      const response = await this.httpService.axiosRef.get(
        `https://api.themoviedb.org/3/movie/${movieId}/credits`,
        config,
      );

      const cast = response.data.cast;
      const crew = response.data.crew;

      const castInfo: ICastInfo = {
        actors: [],
        director: [],
      };

      for (let i = 0; i < 4; i++) {
        castInfo.actors?.push({
          name: cast[i].original_name,
          character: cast[i].character,
          imagePath:
            'https://image.tmdb.org/t/p/w500' +
            cast[i].profile_path,
        });
      }

      for (const crewMember of crew) {
        if (crewMember.job === 'Director') {
          castInfo.director.push({
            name: crewMember.name,
            imagePath:
              'https://image.tmdb.org/t/p/w500' +
              crewMember.profile_path,
          });
          break;
        }
      }

      return castInfo;
    } catch (error) {
      if (error instanceof AxiosError)
        this.handleError(error);

      throw error;
    }
  }

  async getTopFiveTrending(): Promise<ITrendingInfo[]> {
    const config = this.getConfig();

    try {
      const response =
        await this.httpService.axiosRef.get<any>(
          'https://api.themoviedb.org/3/trending/movie/day?language=en-US',
          config,
        );

      const results = response.data.results;
      const trendingMovies: ITrendingInfo[] = [];

      const genresObject = await this.getGenresObject();

      for (let i = 1; i <= 5; i++) {
        trendingMovies.push({
          id: results[i].id,
          adult: results[i].adult,
          imagePath:
            'https://image.tmdb.org/t/p/w500' +
            results[i].poster_path,
          title: results[i].original_title,
          tagline: results[i].overview,
          genres: results[i].genre_ids.map(
            (id: number) => genresObject[id],
          ),
          releaseDate: results[i].release_date,
        });
      }

      return trendingMovies;
    } catch (error) {
      if (error instanceof AxiosError)
        this.handleError(error);

      throw error;
    }
  }

  async getLatestTrendingMovie(): Promise<ITrendingInfo> {
    const config = this.getConfig();

    try {
      const response =
        await this.httpService.axiosRef.get<any>(
          'https://api.themoviedb.org/3/trending/movie/day?language=en-US',
          config,
        );

      const results = response.data.results;

      const genresObject = await this.getGenresObject();

      const latest: ITrendingInfo = {
        id: results[0].id,
        adult: results[0].adult,
        imagePath:
          'https://image.tmdb.org/t/p/w1280' +
          results[0].poster_path,
        title: results[0].original_title,
        tagline: results[0].overview,
        genres: results[0].genre_ids.map(
          (id: number) => genresObject[id],
        ),
        releaseDate: results[0].release_date,
      };

      return latest;
    } catch (error) {
      if (error instanceof AxiosError)
        this.handleError(error);

      throw error;
    }
  }

  getConfig(): AxiosRequestConfig {
    const tmdbApiKey =
      this.configService.get('TMDB_API_KEY');

    return {
      headers: {
        Authorization: 'Bearer ' + tmdbApiKey,
        Accept: 'application/json',
      },
    };
  }

  handleError(error: AxiosError) {
    if (error.response.status === 401)
      throw new UnauthorizedException(
        ErrorMessages.Unauthorized,
      );
    else if (error.response.status === 404) {
      if (
        (error.response.data as ITmdbError).status_code ===
        6
      )
        throw new BadRequestException(
          ErrorMessages.InvalidMovieId,
        );
      else if (
        (error.response.data as ITmdbError).status_code ===
        34
      )
        throw new NotFoundException(
          ErrorMessages.MovieDoesNotExist,
        );
    } else
      throw new InternalServerErrorException(
        ErrorMessages.ErrorFetchingMovieInformation,
      );
  }
}
