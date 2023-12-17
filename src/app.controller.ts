import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  appRunning(): { test: string } {
    return this.appService.appRunning();
  }
}
