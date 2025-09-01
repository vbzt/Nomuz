import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CHAT_ROLE } from '../enums/chat-role.enum';

@Injectable()
export class ChatAccessGuard implements CanActivate {
  constructor ( private readonly prismaService: PrismaService ){ }
  
  async canActivate( context: ExecutionContext ): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const userId = req.user.id
    const chatId = req.params.chatId
    
    const participant = await this.prismaService.chatUser.findFirst( { where: { chat_id: chatId, user_id: userId }, select: { chat: true, role: true } } )
    if(!participant) throw new NotFoundException("Esta conversa não existe ou não pertence a este usuário")
    if(participant.chat.onlyAdmin && participant.role !== CHAT_ROLE.ADMIN && participant.role !== CHAT_ROLE.OWNER) throw new UnauthorizedException("Somente administradores podem mandar mensagem neste grupo")
    return true
  }
}
