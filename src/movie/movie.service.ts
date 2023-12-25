import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';

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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

    const cachedMovies: AllMovies =
      await this.cacheManager.get('movies:dicc_arr');

    try {
      if (cachedMovies) return cachedMovies;

      const response =
        await this.httpService.axiosRef.get<AllMovies>(
          `${modelBaseUrl}/all-movies`,
        );

      const allMovies = response.data;

      if (!allMovies)
        throw new NotFoundException(ErrorMessages.NoMovies);

      await this.cacheManager.set(
        'movies:dicc_arr',
        allMovies,
      );

      return allMovies;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }
    }
  }
}
