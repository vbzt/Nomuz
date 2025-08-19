import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChatAccessGuard } from 'src/common/guards/chat-access.guard';
import { ChatService } from './chat.service'
import { Request } from 'express';
import { User } from '@prisma/client';
import { UserExistsPipe } from 'src/common/pipes/user-exists.pipe';

interface AuthenticatedRequest extends Request {
  user: Pick<User, 'id' | 'email' | 'name' | 'role'>
}



@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService){} 

  @Get()
  async showAllChats(@Req() req: AuthenticatedRequest){ 
    const user = req.user
    return this.chatService.loadChats(user.id)
  }

  
  @Get('/:chatId')
  async getChat( @Param('chatId') chatId: string, @Req() req: AuthenticatedRequest){ 
    return this.chatService.readMessages(chatId)
  }

  @Post()
  async createPrivateChat(@Req() req: AuthenticatedRequest, @Body('recipientUserId', new ParseUUIDPipe( { version: '4'  } ), UserExistsPipe ) recipientUserId: string){ 
    const user = req.user 
    return this.chatService.createPrivateChat(user.id, recipientUserId)
  } 

  @Post('/:chatId/')
  async sendMsg(@Body('content') content: string, @Param('chatId') chatId: string, @Req() req: AuthenticatedRequest ){ 
    return this.chatService.sendMsg(content, chatId, req.user.id)
  }


}
