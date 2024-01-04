import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ErrorMessages } from '../../constants';
import { PrismaService } from '../../prisma/prisma.service';
import { Sentiment } from '../types';

@Injectable()
export class SentimentUtilsService {
  constructor(
    private httpService: HttpService,
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async getSentimentOfReview(
    review: string,
  ): Promise<Sentiment> {
    const modelBaseUrl = this.getModelBaseUrl();

    const response = await this.httpService.axiosRef.get<{
      sentiment: 'Positive' | 'Negative';
    }>(`${modelBaseUrl}/sentiment?review=${review}`);

    return response.data.sentiment;
  }

  async getSentimentOfExistingReview(
    movieId: number,
    reviewId: string,
    userId: string,
  ): Promise<Sentiment> {
    const existingReview =
      await this.prismaService.movieReviews.findFirst({
        where: {
          id: reviewId,
          movieId,
          movieUserId: userId,
        },
      });

    if (!existingReview) {
      throw new NotFoundException(
        ErrorMessages.ReviewDoesNotExist,
      );
    }

    return existingReview.sentiment as Sentiment;
  }

  async editReview(
    movieId: number,
    reviewId: string,
    updatedReview: string,
    userId: string,
  ): Promise<void> {
    const oldSentiment =
      await this.getSentimentOfExistingReview(
        movieId,
        reviewId,
        userId,
      );

    const newSentiment =
      await this.getSentimentOfReview(updatedReview);

    const negativeToPositive =
      oldSentiment === 'Negative' &&
      newSentiment === 'Positive';
    const positiveToNegative =
      oldSentiment === 'Positive' &&
      newSentiment === 'Negative';

    const [_, _review] =
      await this.prismaService.$transaction([
        // Update the review and sentiment
        this.prismaService.movieReviews.update({
          where: {
            movieUserId: userId,
            id: reviewId,
          },
          data: {
            review: updatedReview,
            sentiment: newSentiment,
          },
        }),
        // Update the movie's overall sentiment by first decrementing the old sentiment
        // and then increment the new sentiment
        this.prismaService.movieSentiment.update({
          where: {
            movieId,
          },
          data: {
            negative: {
              increment: negativeToPositive
                ? -1
                : positiveToNegative
                  ? 1
                  : 0,
            },
            positive: {
              increment: positiveToNegative
                ? -1
                : negativeToPositive
                  ? 1
                  : 0,
            },
          },
        }),
      ]);
  }

  async deleteReview(
    movieId: number,
    reviewId: string,
    userId: string,
  ): Promise<void> {
    const sentiment =
      await this.getSentimentOfExistingReview(
        movieId,
        reviewId,
        userId,
      );

    await this.prismaService.$transaction([
      // Delete the review
      this.prismaService.movieReviews.delete({
        where: {
          id: reviewId,
          movieId,
        },
      }),
      // Also reduce the sentiment count from the database
      this.prismaService.movieSentiment.update({
        where: {
          movieId,
        },
        data: {
          negative: {
            decrement: sentiment === 'Negative' ? 1 : 0,
          },
          positive: {
            decrement: sentiment === 'Positive' ? 1 : 0,
          },
        },
      }),
    ]);
  }

  getModelBaseUrl(): string {
    return this.configService.get<string>('MODEL_BASE_URL');
  }
}
