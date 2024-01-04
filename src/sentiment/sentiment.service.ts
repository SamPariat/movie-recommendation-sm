import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  MovieReviews,
  MovieSentiment,
} from '@prisma/client';
import { AxiosError } from 'axios';

import { ErrorMessages } from '../constants';
import { PrismaService } from '../prisma/prisma.service';
import { SentimentUtilsService } from './sentiment-utils/sentiment-utils.service';
import { MovieReviewWithUser } from './types';

@Injectable()
export class SentimentService {
  constructor(
    private prismaService: PrismaService,
    private sentimentUtilsService: SentimentUtilsService,
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
    try {
      const sentiment =
        await this.sentimentUtilsService.getSentimentOfReview(
          review,
        );

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
          // Create a new review if it doesn't exist otherwise update
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
            sentiment: 'Positive',
            movieId,
          },
        });

      const negativeReviews =
        await this.prismaService.movieReviews.count({
          where: {
            sentiment: 'Negative',
            movieId,
          },
        });

      return [
        {
          name: 'Positive',
          value: positiveReviews,
        },
        {
          name: 'Negative',
          value: negativeReviews,
        },
      ];
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleModelError(error);
      }

      throw error;
    }
  }

  async editReview(
    movieId: number,
    reviewId: string,
    updatedReview: string,
    userId: string,
  ): Promise<void> {
    try {
      await this.sentimentUtilsService.editReview(
        movieId,
        reviewId,
        updatedReview,
        userId,
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleModelError(error);
      }
      throw error;
    }
  }

  async deleteReview(
    movieId: number,
    reviewId: string,
    userId: string,
  ): Promise<void> {
    await this.sentimentUtilsService.deleteReview(
      movieId,
      reviewId,
      userId,
    );
  }

  private handleModelError(error: AxiosError) {
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
}
