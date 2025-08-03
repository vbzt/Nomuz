import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
