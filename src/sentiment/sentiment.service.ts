import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { SentimentUtilsService } from './sentiment-utils/sentiment-utils.service';

@Injectable()
export class SentimentService {
  constructor(
    private prismaService: PrismaService,
    private sentimentUtils: SentimentUtilsService,
  ) {}

  async getReviews(
    movie: string,
    page: number,
    limit: number,
  ) {
    return this.sentimentUtils.getReviews(
      movie,
      page,
      limit,
    );
  }

  async addReview(
    review: string,
    movie: string,
    userId: string,
  ) {
    return this.sentimentUtils.saveReview(
      review,
      userId,
      movie,
    );
  }

  async getSentimentDataOfMovie(movie: string) {
    return this.sentimentUtils.getSentimentDataOfMovie(
      movie,
    );
  }
}
