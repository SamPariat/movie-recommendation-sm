import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

import { ErrorMessages } from '../constants';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, SignupDto } from './dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<Tokens> {
    try {
      const existingMovieUser =
        await this.prismaService.movieUsers.findUnique({
          where: {
            email: dto.email,
          },
        });

      if (!existingMovieUser)
        throw new ForbiddenException(
          ErrorMessages.UnableToAuthenticate,
        );

      const isPasswordMatch = await argon.verify(
        existingMovieUser.password,
        dto.password,
      );

      if (!isPasswordMatch)
        throw new ForbiddenException(
          ErrorMessages.UnableToAuthenticate,
        );

      const tokens = await this.signTokens(
        existingMovieUser.id,
        existingMovieUser.email,
      );

      await this.updateRefreshTokenHash(
        existingMovieUser.id,
        tokens.refresh_token,
      );

      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async signup(dto: SignupDto): Promise<Tokens> {
    try {
      const hashedPassword = await argon.hash(dto.password);

      const newMovieUser =
        await this.prismaService.movieUsers.create({
          data: {
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
          },
        });

      const tokens = await this.signTokens(
        newMovieUser.id,
        newMovieUser.email,
      );

      await this.updateRefreshTokenHash(
        newMovieUser.id,
        tokens.refresh_token,
      );

      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(
          ErrorMessages.InvalidCredentials,
        );
      }
      throw error;
    }
  }

  async logout(userId: string) {
    try {
      await this.prismaService.movieUsers.update({
        where: {
          id: userId,
          hashedRefreshToken: {
            not: null,
          },
        },
        data: {
          hashedRefreshToken: null,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ) {
    try {
      const existingMovieUser =
        await this.prismaService.movieUsers.findUnique({
          where: {
            id: userId,
          },
        });

      if (!existingMovieUser)
        throw new ForbiddenException();

      const isRefreshTokenMatch = await argon.verify(
        existingMovieUser.hashedRefreshToken,
        refreshToken,
      );

      if (!isRefreshTokenMatch)
        throw new ForbiddenException();

      const tokens = await this.signTokens(
        existingMovieUser.id,
        existingMovieUser.email,
      );
      await this.updateRefreshTokenHash(
        existingMovieUser.id,
        tokens.refresh_token,
      );

      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async updateRefreshTokenHash(
    userId: string,
    refreshToken: string,
  ) {
    const hashedRefreshToken =
      await argon.hash(refreshToken);

    await this.prismaService.movieUsers.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken,
      },
    });
  }

  async generateAccessToken(userId: string, email: string) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        expiresIn: '15m',
        secret: this.configService.get<string>(
          'JWT_ACCESS_TOKEN_SECRET',
        ),
      },
    );
  }

  async generateRefreshToken(
    userId: string,
    email: string,
  ) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        expiresIn: '7d',
        secret: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_SECRET',
        ),
      },
    );
  }

  async signTokens(
    userId: string,
    email: string,
  ): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all(
      [
        this.generateAccessToken(userId, email),
        this.generateRefreshToken(userId, email),
      ],
    );

    return { access_token, refresh_token };
  }
}
