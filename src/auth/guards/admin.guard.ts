import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {PrismaService} from '../../../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userJWT = request.user;
    const user = await this.prisma.user.findFirst({
      where: { id: userJWT.id }
    });

    if (!user) {
      throw new ForbiddenException('Access denied. User not authenticated.');
    }

    if (!user.isAdmin) {
      throw new ForbiddenException('Access denied. Only administrators can access this route.');
    }

    return true;
  }
}
