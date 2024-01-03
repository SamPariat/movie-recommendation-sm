import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
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

  @Get('get-all-reviews/:id')
  @HttpCode(HttpStatus.OK)
  async getAllReviews(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ reviews: MovieReviews[] }> {
    return this.sentimentService.getAllReviews(id);
  }

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

  @UseGuards(AccessTokenGuard)
  @Patch('edit-review/:id')
  @HttpCode(HttpStatus.OK)
  async editReview(
    @Param('id', ParseIntPipe) id: number,
    @Query('reviewId') reviewId: string,
    @Body('review') updatedReview: string,
    @GetUserId() userId: string,
  ) {
    return this.sentimentService.editReview(
      id,
      reviewId,
      updatedReview,
      userId,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Delete('delete-review/:id')
  async deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @Query('reviewId') reviewId: string,
    @GetUserId() userId: string,
  ) {
    return this.sentimentService.deleteReview(
      id,
      reviewId,
      userId,
    );
  }
}
