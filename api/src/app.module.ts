import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module'
import { ChatGateway } from './modules/chat/chat.gateway';

@Module({
  imports: [UserModule, ChatGateway],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
