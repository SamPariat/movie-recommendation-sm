import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';

import { ErrorMessages, Sentiment } from '../../constants';
import { PrismaService } from '../../prisma/prisma.service';
import { IMovieReview } from '../types';

@Injectable()
export class SentimentUtilsService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async saveReview(
    review: string,
    userId: string,
    movie: string,
  ): Promise<IMovieReview> {
    const modelBaseUrl = this.getModelBaseUrl();

    try {
      const response = await this.httpService.axiosRef.get<{
        sentiment: Sentiment.Positive | Sentiment.Negative;
      }>(`${modelBaseUrl}/sentiment?review=${review}`);

      const { sentiment } = response.data;

      const newReview = await this.createNewReview(
        movie,
        review,
        sentiment,
        userId,
      );

      return newReview;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response.status === 400)
          throw new BadRequestException(
            ErrorMessages.NoReviewProvided,
          );
        else if (error.response.status === 500)
          throw new ServiceUnavailableException(
            ErrorMessages.ErrorFetchingSentiment,
          );

        throw new InternalServerErrorException(
          ErrorMessages.ErrorFetchingSentiment,
        );
      }

      throw error;
    }
  }

  async getSentimentDataOfMovie(movie: string): Promise<
    {
      name: string;
      value: number;
    }[]
  > {
    try {
      const positiveReviews =
        await this.prismaService.moviereviews.count({
          where: {
            sentiment: Sentiment.Positive,
            movie,
          },
        });

      const negativeReviews =
        await this.prismaService.moviereviews.count({
          where: {
            sentiment: Sentiment.Negative,
            movie,
          },
        });

      return [
        {
          name: Sentiment.Positive,
          value: positiveReviews,
        },
        {
          name: Sentiment.Negative,
          value: negativeReviews,
        },
      ];
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response.status === 500) {
          throw new ServiceUnavailableException(
            ErrorMessages.ErrorFetchingSentiment,
          );
        } else {
          throw new ServiceUnavailableException(
            ErrorMessages.ModelServiceUnavailable,
          );
        }
      }

      throw error;
    }
  }

  async getReviews(
    movie: string,
    page: number,
    limit: number,
  ): Promise<{ reviews: IMovieReview[] }> {
    try {
      const reviews =
        await this.prismaService.moviereviews.findMany({
          take: limit,
          skip: (page - 1) * limit,
          where: {
            movie,
          },
        });

      return { reviews };
    } catch (error) {
      throw error;
    }
  }

  getModelBaseUrl(): string {
    return this.configService.get<string>('MODEL_BASE_URL');
  }

  async createNewReview(
    movie: string,
    review: string,
    sentiment: Sentiment,
    movieuserId: string,
  ) {
    try {
      const newReview =
        await this.prismaService.moviereviews.create({
          data: {
            movie,
            review,
            sentiment,
            movieuserId,
          },
        });

      return newReview;
    } catch (error) {
      throw error;
    }
  }
}
