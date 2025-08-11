import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/common/utils/env';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { ChatService } from '../chat/chat.service';
import { ChatGateway } from '../chat/chat.gateway';

@Module({
  imports: [PrismaModule, 
    forwardRef(() => UserModule), 
    JwtModule.register( { secret: env('JWT_SECRET' ) } ),
    PassportModule
  ],
    
  providers: [AuthService, JwtStrategy ],
  controllers: [AuthController],
  exports: [AuthService] 
})
export class AuthModule {}
