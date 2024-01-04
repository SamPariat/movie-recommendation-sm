import { Module } from '@nestjs/common';

import { SentimentUtilsModule } from './sentiment-utils/sentiment-utils.module';
import { SentimentController } from './sentiment.controller';
import { SentimentService } from './sentiment.service';

@Module({
  imports: [SentimentUtilsModule],
  providers: [SentimentService],
  controllers: [SentimentController],
})
export class SentimentModule {}
