import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MovieUtilsModule } from '../movie/movie-utils/movie-utils.module';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';

@Module({
  imports: [HttpModule, MovieUtilsModule],
  providers: [RecommendationService],
  controllers: [RecommendationController],
})
export class RecommendationModule {}
