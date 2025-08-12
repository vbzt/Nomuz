import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ThrottlerStorageProvider } from '@nestjs/throttler/dist/throttler.providers';

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

}
