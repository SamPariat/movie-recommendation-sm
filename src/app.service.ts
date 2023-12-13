import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  appRunning(): { test: string } {
    return { test: 'Application is running' };
  }
}
