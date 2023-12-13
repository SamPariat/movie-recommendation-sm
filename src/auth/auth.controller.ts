import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { GetUser, GetUserId } from './decorator';
import { LoginDto, SignupDto } from './dto';
import {
  AccessTokenGuard,
  RefreshTokenGuard,
} from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('local/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetUser('refreshToken') refreshToken: string,
    @GetUserId() userId: string,
  ) {
    return this.authService.refreshTokens(
      userId,
      refreshToken,
    );
  }
}
