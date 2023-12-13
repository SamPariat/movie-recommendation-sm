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

import { GetUserId } from '../auth/decorator';
import { AccessTokenGuard } from '../auth/guard';
import { SentimentService } from './sentiment.service';

@Controller('sentiment')
export class SentimentController {
  constructor(private sentimentService: SentimentService) {}

  @Get('get-reviews/:movie')
  async getReviews(
    @Param('movie') movie: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return this.sentimentService.getReviews(
      movie,
      page,
      limit,
    );
  }

  @Get('review-analytics/:movie')
  async getSentimentDataOfMovie(
    @Param('movie') movie: string,
  ) {
    return this.sentimentService.getSentimentDataOfMovie(
      movie,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post('save-review/:movie')
  @HttpCode(HttpStatus.CREATED)
  async saveReview(
    @Param('movie') movie: string,
    @Body('review') review: string,
    @GetUserId() userId: string,
  ) {
    return this.sentimentService.addReview(
      review,
      movie,
      userId,
    );
  }
}
