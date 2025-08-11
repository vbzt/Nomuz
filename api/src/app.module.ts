import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module'
import { ChatGateway } from './modules/chat/chat.gateway';
import { ResendModule } from 'nest-resend';
import { env } from './common/utils/env';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [UserModule, AuthModule, ChatModule, ResendModule.forRoot( { apiKey: env('RESEND_API_KEY') } ) ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
