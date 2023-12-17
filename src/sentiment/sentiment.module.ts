import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { SentimentController } from './sentiment.controller';
import { SentimentService } from './sentiment.service';

@Module({
  imports: [HttpModule],
  providers: [SentimentService],
  controllers: [SentimentController],
})
export class SentimentModule {}
