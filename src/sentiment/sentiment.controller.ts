import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MovieReviews } from '@prisma/client';

import { GetUserId } from '../auth/decorator';
import { AccessTokenGuard } from '../auth/guard';
import { SentimentService } from './sentiment.service';

@Controller('sentiment')
export class SentimentController {
  constructor(private sentimentService: SentimentService) {}

  @Get('get-reviews/:id')
  @HttpCode(HttpStatus.OK)
  async getReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<{ reviews: MovieReviews[] }> {
    return this.sentimentService.getReviews(
      id,
      page,
      limit,
    );
  }

  @Get('review-analytics/:id')
  @HttpCode(HttpStatus.OK)
  async getSentimentDataOfMovie(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<
    {
      name: string;
      value: number;
    }[]
  > {
    return this.sentimentService.getSentimentDataOfMovie(
      id,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post('save-review/:id')
  @HttpCode(HttpStatus.CREATED)
  async saveReview(
    @Param('id', ParseIntPipe) id: number,
    @Body('review') review: string,
    @GetUserId() userId: string,
  ): Promise<MovieReviews> {
    return this.sentimentService.saveReview(
      id,
      review,
      userId,
    );
  }
}
