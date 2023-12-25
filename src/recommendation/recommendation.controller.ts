import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';

import { MovieInfo } from '../movie/types';
import { RecommendationService } from './recommendation.service';

@Controller('model')
export class RecommendationController {
  constructor(
    private recommendationService: RecommendationService,
  ) {}

  @Get('recommendation')
  @HttpCode(HttpStatus.OK)
  async getRecommendation(
    @Query('movie') movie: string,
  ): Promise<{
    recommendations: MovieInfo[];
  }> {
    return this.recommendationService.getRecommendation(
      movie,
    );
  }
}
