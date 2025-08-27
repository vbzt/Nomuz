import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto'
import { encrypt } from 'src/common/security/encrypt';
import { decrypt } from 'src/common/security/decrypt';
import { User } from '@prisma/client';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-session.interface';
import { CreateGroupDTO } from './dto/create-group.dto';
import { CHAT_ROLE } from 'src/common/enums/chat-role.enum';
import { UpdateGroupDTO } from './dto/update-group.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService){ }

  async createPrivateChat(req: AuthenticatedRequest, recipientUser: User){  
  const existingChat = await this.prismaService.chat.findFirst({
    where: {
      isGroup: false,
      users: {
        every: {
          user_id: { in: [req.user.id, recipientUser.id] }
        }
      },
      AND: [
        { users: { some: { user_id: req.user.id } } },
        { users: { some: { user_id: recipientUser.id } } }
      ],
    },
    include: { users: true }
  });

  if (existingChat && existingChat.users.length === 2) {
    return existingChat; 
  }

  const newChat = await this.prismaService.chat.create({
    data: { 
      isGroup: false, 
      users: { 
        create: [ 
          { user_id: req.user.id, role: 'MEMBER', user_name: req.user.name }, 
          { user_id: recipientUser.id, role: 'MEMBER', user_name: recipientUser.name } 
        ] 
      } 
    } 
  });

  return newChat;
  }

  async createGroupChat(req: AuthenticatedRequest, members: User[], { name }: CreateGroupDTO){ 
    const allMembers = [ { ...req.user, role: 'OWNER' }, ...members.map(u => ({ ...u, role: 'MEMBER' })) ]
    return this.prismaService.chat.create({
        data: {
          isGroup: true,
          name: name || `Grupo de ${req.user.name}`,
          users: {
            create: allMembers.map(m => ({
              role: CHAT_ROLE[m.role as keyof typeof CHAT_ROLE],
              user_name: m.name, 
              user: {
                connect: { id: m.id }
              }
            }))
          }
        },
        include: {
          users: {
            include: {
              user: true
            }
          }
        }
      });
  }

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

  async updateGroupChat(req: AuthenticatedRequest, data: UpdateGroupDTO, chatId: string){
    if(!data.adminOnly && !data.name ) return { message: "Nenhuma alteração foi feita"} 
    const updatedGroup = await this.prismaService.chat.update({ where: { id: chatId }, data: { ...(data.adminOnly !== undefined && { onlyAdmin: data.adminOnly }), ...(data.name && { name: data.name }),},
  select: { name: true, onlyAdmin: true, users: true }
})
    return { success: true, message: `Grupo atualizado por: ${req.user.name}`, updatedGroup }
  }

  async addMember(req: AuthenticatedRequest, member: User, chatId: string ){ 
    const newMember = await this.prismaService.chat.update( { where: { id: chatId }, 
      data: { users: 
        { create: 
          { role: 'MEMBER',
            user_name: member.name, 
            user: { connect: { id: member.id } }
          }
        }
      },
      include: { users: true } 
    })
    return { success: true, message: `${req.user.name} adicionou ${member.name} ao grupo.`, newMember}
  }

  async editMember(req: AuthenticatedRequest, member: User, role: CHAT_ROLE, chatId: string){ 
    const updatedMember = await this.prismaService.chatUser.update( { where: { chat_id_user_id: { chat_id: chatId, user_id: member.id } }, data: { role } })
    return { success: true, message: `${req.user.name} atualizou o papel de ${member.name} para ${role} no grupo.`, updatedMember}
  }

  async leaveGroup(req: AuthenticatedRequest, chatId: string){ 
    const removedMember = await this.prismaService.chatUser.delete( { where: { chat_id_user_id : { chat_id: chatId, user_id: req.user.id } } }  )
    return { success: true, message: `${req.user.name} saiu do grupo.`, removedMember}
  }

  async removeMember(req: AuthenticatedRequest, chatId: string, member: User){  
    const removedMember = await this.prismaService.chatUser.delete( { where: { chat_id_user_id : { chat_id: chatId, user_id: member.id } } }  )
    return { success: true, message: `${req.user.name} removeu ${member.name} ao grupo.`, removedMember}
  }

  async sendMsg(content: string, chatId: string, userId: string){ 
    const encryptedMessage = this.encryptMsg(content)
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
