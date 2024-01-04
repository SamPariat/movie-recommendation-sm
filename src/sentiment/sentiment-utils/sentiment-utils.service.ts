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

  async getSentimentOfReview(review: string) {
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

  getModelBaseUrl(): string {
    return this.configService.get<string>('MODEL_BASE_URL');
  }
}
