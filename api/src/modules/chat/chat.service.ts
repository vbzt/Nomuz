import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ThrottlerStorageProvider } from '@nestjs/throttler/dist/throttler.providers';
import crypto from 'crypto'
import { encrypt } from 'src/common/security/encrypt';
import { decrypt } from 'src/common/security/decrypt';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService){ }

  async loadChats(userId: string) {
  return this.prismaService.chat.findMany({
    where: { users: { some: { user_id: userId } } },
    include: {
      users: {
        include: {
          user: { select: { id: true, name: true } } // Pega o nome
        }
      }
    }
  });
  } 


  async createPrivateChat(userId: string, recipientUserId: string){  
       const existingChat = await this.prismaService.chat.findFirst({
        where: {
          isGroup: false,
          users: {
            every: {
              user_id: { in: [userId, recipientUserId] }
            }
          },
          AND: [
            { users: { some: { user_id: userId } } },
            { users: { some: { user_id: recipientUserId } } }
          ],
        },
        include: { users: true }
        });

  if (existingChat && existingChat.users.length === 2) {
    return existingChat; 
  }

    const newChat = await this.prismaService.chat.create( { data: { isGroup: false, users: { create: [ { user_id: userId, role: 'MEMBER' }, { user_id: recipientUserId, role: 'MEMBER' } ] } } } )
    return newChat 
  }

  async sendMsg(content: string, chatId: string, userId: string){ 
    const encryptedMessage = this.encryptMsg(content)
    await this.chatExists(chatId)
    const savedMessage = await this.prismaService.message.create({ data: { content: encryptedMessage, hash: '234', chat_id: chatId, sender_id: userId} } )
    return savedMessage
  }

  async readMessages(chatId: string){ 
    const chatMessages = await this.prismaService.chat.findMany({ where: { id: chatId }, select: { messages: true} } )
    for(const message of chatMessages[0].messages){ 
      console.log(decrypt(message.content))
    }
  }


   encryptMsg(content: string){ 
    const encrypted = encrypt(content)
    return encrypted
  }

  async chatExists(chatId: string){
    const chat = await this.prismaService.chat.findUnique({ where: { id: chatId } } )
    if(!chat) throw new NotFoundException('Esta conversa não existe.')
    return chat
  }


 generateMessageHash(chat_id: string, sender_id: string, content: string, createdAt: Date) {
  return crypto
    .createHash('sha256')
    .update(`${chat_id}:${sender_id}:${content}:${createdAt.toISOString()}`)
    .digest('hex');
}

}
