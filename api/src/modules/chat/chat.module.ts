import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatController } from './chat.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
 