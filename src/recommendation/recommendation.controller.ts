import { Controller, Get, Query } from '@nestjs/common';

import { RecommendationService } from './recommendation.service';

@Controller('model')
export class RecommendationController {
  constructor(
    private recommendationService: RecommendationService,
  ) {}

  @Get('recommendation')
  async getRecommendation(@Query('movie') movie: string) {
    return this.recommendationService.getRecommendation(
      movie,
    );
  }
}
