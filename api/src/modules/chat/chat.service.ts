import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService){ }

  async createPrivateChat(userId: string, recipientUserId: string){ 
    const existingChat = await this.prismaService.chat.findFirst( 
      { where: { isGroup: false, users: { every: { OR: [ { user_id: userId }, { user_id: recipientUserId } ] } } } } 
    )

    if(existingChat) return existingChat  

    const newChat = await this.prismaService.chat.create( { data: { isGroup: false, users: { create: [ { user_id: userId, role: 'MEMBER' }, { user_id: recipientUserId, role: 'MEMBER' } ] } } } )
    return newChat 
  }

}
