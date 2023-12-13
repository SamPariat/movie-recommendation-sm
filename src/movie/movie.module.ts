import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MovieUtilsModule } from './movie-utils/movie-utils.module';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
  imports: [MovieUtilsModule, HttpModule],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
