import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ChatAccessGuard implements CanActivate {
  constructor ( private readonly prismaService: PrismaService ){ }
  
  async canActivate( context: ExecutionContext ): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const userId = req.user.id
    const chatId = req.params.chatId

    const participant = await this.prismaService.chatUser.findFirst( { where: { chat_id: chatId, user_id: userId } } )
    if(!participant) throw new NotFoundException("Esta conversa não existe ou não pertence a este usuário")
    return true
  }
}
