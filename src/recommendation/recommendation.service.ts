import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';

import { ErrorMessages } from '../constants';
import { MovieUtilsService } from '../movie/movie-utils/movie-utils.service';
import { IMovieInfo } from '../movie/types';

@Injectable()
export class RecommendationService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
    private configService: ConfigService,
    private movieUtilsService: MovieUtilsService,
  ) {}

  async getRecommendation(movie: string) {
    try {
      const modelBaseUrl = this.configService.get<string>(
        'MODEL_BASE_URL',
      );

      const cachedRecommendations: IMovieInfo[] =
        await this.cacheManager.get(
          `recommendations:${movie}`,
        );

      if (cachedRecommendations)
        return cachedRecommendations;

      const response = await this.httpService.axiosRef.get<
        {
          id: number;
          title: string;
        }[]
      >(`${modelBaseUrl}/movie-prediction?movie=${movie}`);

      const predictedMovies = response.data;

      const movieInfoPromise = predictedMovies.map(
        async (pred) => {
          const movieInfo =
            await this.movieUtilsService.getMovieInformationById(
              pred.id,
            );
          return movieInfo ? { ...movieInfo } : null;
        },
      );

      const movieData = (
        await Promise.all(movieInfoPromise)
      ).filter((pred) => pred !== null);

      await this.cacheManager.set(
        `recommendations:${movie}`,
        { recommendations: movieData },
      );

      return { recommendations: movieData };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response.status === 400) {
          throw new NotFoundException(
            ErrorMessages.MovieDoesNotExist,
          );
        } else if (error.response.status === 500) {
          throw new ServiceUnavailableException(
            ErrorMessages.ModelServiceUnavailable,
          );
        }
      }

      throw error;
    }
  }
}
