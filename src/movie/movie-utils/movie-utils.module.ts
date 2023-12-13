import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MovieUtilsService } from './movie-utils.service';

@Module({
  imports: [HttpModule],
  providers: [MovieUtilsService],
  exports: [MovieUtilsService],
})
export class MovieUtilsModule {}
