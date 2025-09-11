import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ROLE } from '../enums/user-role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const req = context.switchToHttp().getRequest()
    const user = req.user

    const userRole = await this.prismaService.user.findUnique( { where: { id: user.id }, select: { role: true } } )
    if(userRole?.role !== ROLE.ADMIN) return false
    return true
  }
}