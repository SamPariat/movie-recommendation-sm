import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { GetUserId } from '../auth/decorator';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
} from '../auth/guard';
import { UserUpdateDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Patch('update-details')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateAccount(
    @GetUserId() userId: string,
    dto: UserUpdateDto,
  ) {
    return this.userService.updateAccount(userId, dto);
  }

  @UseGuards(RefreshTokenGuard)
  @Delete('delete-account')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@GetUserId() userId: string) {
    return this.userService.deleteAccount(userId);
  }
}
