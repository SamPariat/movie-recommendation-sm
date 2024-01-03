import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { UserUpdateDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async updateAccount(userId: string, dto: UserUpdateDto) {
    await this.prismaService.movieUsers.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteAccount(userId: string) {
    await this.prismaService.movieUsers.delete({
      where: {
        id: userId,
      },
    });
  }
}
