import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChatService } from './chat.service'
import { User } from '@prisma/client';
import { UserExistsPipe } from 'src/common/pipes/user-exists.pipe';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-session.interface';
import { ChatAccessGuard } from 'src/common/guards/chat-access.guard';




@UseGuards(AuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService){} 

  @Get()
  async showAllChats(@Req() req: AuthenticatedRequest){ 
    const user = req.user
    return this.chatService.loadChats(user.id)
  }

  @UseGuards(ChatAccessGuard)
  @Get('/:chatId')
  async getChat( @Param('chatId') chatId: string ){ 
    return this.chatService.readMessages(chatId)
  }

  @Post()
  async createPrivateChat(@Req() req: AuthenticatedRequest, @Body('recipientUserId', new ParseUUIDPipe( { version: '4'  } ), UserExistsPipe ) recipientUser: User){ 
    return this.chatService.createPrivateChat(req, recipientUser)
  } 

  @Post('/:chatId/')
  async sendMsg(@Body('content') content: string, @Param('chatId', new ParseUUIDPipe( { version: "4" } ) ) chatId: string, @Req() req: AuthenticatedRequest ){ 
    return this.chatService.sendMsg(content, chatId, req.user.id)
  }


}
