import { Controller, Get, Param } from '@nestjs/common';

@Controller('chat')
export class ChatController {

  @Get()
  async showAllChats(){ 

  }

  @Get('/:chatId')
  async getChat(@Param('chatId') token: string){ 

  }


}
