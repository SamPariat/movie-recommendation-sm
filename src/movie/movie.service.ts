import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';

import { ErrorMessages } from '../constants';
import { MovieUtilsService } from './movie-utils/movie-utils.service';
import {
  AllMovies,
  CastInfo,
  MovieInfo,
  TrendingInfo,
} from './types';

@Injectable()
export class MovieService {
  constructor(
    private movieUtils: MovieUtilsService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getMovieInformationById(
    movieId: number,
  ): Promise<MovieInfo> {
    const movieInfo =
      await this.movieUtils.getMovieInformationById(
        movieId,
      );
    return movieInfo;
  }

  async getMovieCastById(
    movieId: number,
  ): Promise<CastInfo> {
    const movieCast =
      await this.movieUtils.getMovieCastById(movieId);
    return movieCast;
  }

  async getTopFiveTrending(): Promise<{
    top5Trending: TrendingInfo[];
  }> {
    const top5Trending =
      await this.movieUtils.getTopFiveTrending();
    return { top5Trending };
  }

  async getLatestTrending(): Promise<{
    latestTrending: TrendingInfo;
  }> {
    const latestTrending =
      await this.movieUtils.getLatestTrendingMovie();
    return { latestTrending };
  }

  async getAllMovies() {
    const modelBaseUrl = this.configService.get<string>(
      'MODEL_BASE_URL',
    );

    try {
      const response =
        await this.httpService.axiosRef.get<AllMovies>(
          `${modelBaseUrl}/all-movies-new`,
        );

      const allMovies = response.data;

      if (!allMovies)
        throw new NotFoundException(ErrorMessages.NoMovies);

      return allMovies;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }
    }
  }
}
