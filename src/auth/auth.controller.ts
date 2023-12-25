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
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignupDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('local/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetUserId() userId: string): Promise<void> {
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetUser('refreshToken') refreshToken: string,
    @GetUserId() userId: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(
      userId,
      refreshToken,
    );
  }
}
