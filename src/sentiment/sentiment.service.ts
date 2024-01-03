import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MovieReviews } from '@prisma/client';
import { AxiosError } from 'axios';

import { ErrorMessages, Sentiment } from '../constants';
import { PrismaService } from '../prisma/prisma.service';
import { MovieReviewWithUser } from './types';

@Injectable()
export class SentimentService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private httpService: HttpService,
  ) {}

  async getAllReviews(
    movieId: number,
  ): Promise<{ reviews: MovieReviewWithUser[] }> {
    const reviews =
      await this.prismaService.movieReviews.findMany({
        where: {
          movieId,
        },
        include: {
          movieUser: {
            select: {
              name: true,
            },
          },
        },
      });

    return { reviews };
  }

  async getReviews(
    movieId: number,
    page: number,
    limit: number,
  ): Promise<{ reviews: MovieReviewWithUser[] }> {
    const reviews =
      await this.prismaService.movieReviews.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: {
          movieId,
        },
        include: {
          movieUser: {
            select: {
              name: true,
            },
          },
        },
      });

    return { reviews };
  }

  async saveReview(
    movieId: number,
    review: string,
    movieUserId: string,
  ): Promise<MovieReviews> {
    const modelBaseUrl = this.getModelBaseUrl();

    try {
      const response = await this.httpService.axiosRef.get<{
        sentiment: 'Positive' | 'Negative';
      }>(`${modelBaseUrl}/sentiment?review=${review}`);

      const { sentiment } = response.data;

      const [newReview, _sentimentValue] =
        await this.prismaService.$transaction([
          this.prismaService.movieReviews.create({
            data: {
              movieId,
              review,
              sentiment,
              movieUserId,
            },
          }),
          this.prismaService.movieSentiment.upsert({
            create: {
              movieId,
              positive: sentiment === 'Positive' ? 1 : 0,
              negative: sentiment === 'Negative' ? 1 : 0,
            },
            where: {
              movieId,
            },
            update: {
              positive: {
                increment: sentiment === 'Positive' ? 1 : 0,
              },
              negative: {
                increment: sentiment === 'Negative' ? 1 : 0,
              },
            },
          }),
        ]);

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

  async getSentimentDataOfMovie(movieId: number): Promise<
    {
      name: string;
      value: number;
    }[]
  > {
    try {
      const positiveReviews =
        await this.prismaService.movieReviews.count({
          where: {
            sentiment: Sentiment.Positive,
            movieId,
          },
        });

      const negativeReviews =
        await this.prismaService.movieReviews.count({
          where: {
            sentiment: Sentiment.Negative,
            movieId,
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

  async editReview(
    movieId: number,
    reviewId: string,
    updatedReview: string,
    userId: string,
  ) {}

  async deleteReview(
    movieId: number,
    reviewId: string,
    userId: string,
  ) {}

  private getModelBaseUrl(): string {
    return this.configService.get<string>('MODEL_BASE_URL');
  }
}
