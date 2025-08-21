import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto'
import { encrypt } from 'src/common/security/encrypt';
import { decrypt } from 'src/common/security/decrypt';
import { User } from '@prisma/client';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-session.interface';
import { CreateGroupDTO } from './dto/create-group.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService){ }

  async loadChats(userId: string) {
  return this.prismaService.chat.findMany({
    where: { users: { some: { user_id: userId } } },
    include: {
      users: {
        include: {
          user: { select: { id: true, name: true } } 
        }
      }
    }
  });
  } 

  async sendMsg(content: string, chatId: string, userId: string){ 
    const encryptedMessage = this.encryptMsg(content)
    console.log(chatId)
    await this.chatExists(chatId)
    const savedMessage = await this.prismaService.message.create({ data: { content: encryptedMessage, hash: this.generateMessageHash(chatId, userId, encryptedMessage), chat_id: chatId, sender_id: userId} } )
    savedMessage.content = content
    return savedMessage
  }

  async readMessages(chatId: string) {
  const chat = await this.prismaService.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }, 
        select: {
          id: true,
          content: true,
          createdAt: true,
          sender_id: true,
          sender: { select: { id: true, name: true } },
        },
      },
      users: {
        select: {
          user_name: true,
          user: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!chat) throw new NotFoundException('Esta conversa não existe');

  return {
    messages: chat.messages.map(msg => ({
      ...msg,
      content: decrypt(msg.content),
    })),
    users: chat.users,
  };
  }

  encryptMsg(content: string){ 
    const encrypted = encrypt(content)
    return encrypted
  }

  async chatExists(chatId: string){
    const chat = await this.prismaService.chat.findUnique({ where: { id: chatId }, include: { users: true } } )
    if(!chat) throw new NotFoundException('Esta conversa não existe.')
    return chat
  }


 generateMessageHash(chat_id: string, sender_id: string, content: string, createdAt?: Date) {
  if(!createdAt) createdAt = new Date() 
  return crypto.createHash('sha256').update(`${chat_id}:${sender_id}:${content}:${createdAt.toISOString()}`).digest('hex');
}

}
