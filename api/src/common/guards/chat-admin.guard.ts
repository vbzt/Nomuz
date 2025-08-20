import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ChatService } from 'src/modules/chat/chat.service';

@Injectable()
export class ChatAdminGuard implements CanActivate {
  constructor(private readonly chatService: ChatService) {}

  async canActivate(context: ExecutionContext):Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const userId = req.user.id
    const chatId = req.params.chatId 

    const chat = await this.chatService.chatExists(chatId)
    const isAdmin = chat.users.some((user) => user.id === userId && user.role === 'ADMIN')

    if(!isAdmin) throw new ForbiddenException('Você não é administrador deste grupo.')
    return isAdmin 
  }
}