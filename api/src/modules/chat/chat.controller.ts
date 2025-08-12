import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChatAccessGuard } from 'src/common/guards/chat-access.guard';
import { ChatService } from './chat.service'
import { Request } from 'express';
import { User } from '@prisma/client';

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

  @Post()
  async createPrivateChat(@Req() req: AuthenticatedRequest, @Body('recipientUserId') recipientUserId: string){ 
    const user = req.user 
    return this.chatService.createPrivateChat(user.id, recipientUserId)
  } 


}
