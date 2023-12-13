import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './users.service';

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
