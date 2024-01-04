import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { SentimentUtilsService } from './sentiment-utils.service';

@Module({
  imports: [HttpModule],
  providers: [SentimentUtilsService],
  exports: [SentimentUtilsService],
})
export class SentimentUtilsModule {}
