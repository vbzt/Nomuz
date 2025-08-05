import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/common/utils/env';

@Module({
  imports: [PrismaModule, forwardRef(() => UserModule), JwtModule.register({ 
    secret: env('JWT_SECRET')
  })],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService] 
})
export class AuthModule {}
