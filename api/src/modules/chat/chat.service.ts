import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  // messages 
 async loadChats(userId: string) {
  const unreadCondition = {
    reads: { none: { userId } },
    sender_id: { not: userId },
  };

  const chats = await this.prismaService.chat.findMany({
    where: { users: { some: { user_id: userId } } },
    include: {
      users: {
        include: {
          user: { select: { id: true, name: true, profilePicture: true } },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: { select: { id: true, name: true } },
        },
        omit: { hash: true}
      },
      _count: {
        select: {
          messages: { where: unreadCondition },
        },
      },
    },
  });

  return chats.map(chat => {
    const lastMsg = chat.messages[0];
    if (lastMsg) {
      try {
        lastMsg.content = decrypt(lastMsg.content);
      } catch {
        lastMsg.content = " ";
      }
    }
    return chat;
  });
}



  async sendMsg(content: string,  chatId: string, userId: string, files?: Array<Express.Multer.File>,){ 
    const encryptedMessage = this.encryptMsg(content)
    await this.chatExists(chatId)
    const savedMessage = await this.prismaService.message.create({ data: { content: encryptedMessage, hash: this.generateMessageHash(chatId, userId, encryptedMessage), chat_id: chatId, sender_id: userId} } )
    savedMessage.content = content
    return { success: true, message: 'Mensagem enviada com sucesso', data: savedMessage }
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

    if (!chat) throw new NotFoundException('Conversa não encontrada');

    return { success: true, message: 'Mensagens carregadas com sucesso', data: { messages: chat.messages.map(msg => ({ ...msg, content: decrypt(msg.content) })), users: chat.users } };
  }

  async markMessageAsRead(messageId: string, userId: string){
    const readMessage = await this.prismaService.messageRead.upsert( { where: { messageId_userId: { messageId, userId } }, create: { messageId, userId, readAt: new Date()}, update: { readAt: new Date()} })
    return readMessage
  }

  // chat
  async createPrivateChat(req: AuthenticatedRequest, recipientUser: User){  
    if(recipientUser.id === req.user.id) throw new BadRequestException('Não é possível criar uma conversa consigo mesmo.')

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
      return { success: true, message: 'Conversa privada já existente', data: existingChat };
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

    return { success: true, message: 'Conversa privada criada com sucesso', data: newChat };
  }

  // groups 
  async getMembers(chatId: string){ 
    const members = await this.prismaService.chatUser.findMany( { where: { chat_id: chatId } } )
    return members
  } 

  async createGroupChat(req: AuthenticatedRequest, members: User[], { name }: CreateGroupDTO){ 
    const allMembers = [ { ...req.user, role: 'OWNER' }, ...members.map(u => ({ ...u, role: 'MEMBER' })) ]
    const group = await this.prismaService.chat.create({
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
    return { success: true, message: `Grupo "${group.name}" criado com sucesso`, data: group };
  }

  async updateGroupChat(req: AuthenticatedRequest, data: UpdateGroupDTO, chatId: string){
    if(!data.adminOnly && !data.name ) return { message: "Nenhuma alteração foi feita"} 
    const updatedGroup = await this.prismaService.chat.update({ where: { id: chatId }, data: { ...(data.adminOnly !== undefined && { onlyAdmin: data.adminOnly }), ...(data.name && { name: data.name })}, select: { name: true, onlyAdmin: true, users: true }})
    return { success: true, message: `Grupo atualizado por ${req.user.name}`, data: updatedGroup }
  }

  async deleteGroupChat(chatId: string) {
    const [deletedMessages, deletedUsers, deletedGroup] = await this.prismaService.$transaction([
      this.prismaService.message.deleteMany({ where: { chat_id: chatId } }),
      this.prismaService.chatUser.deleteMany({ where: { chat_id: chatId } }),
      this.prismaService.chat.delete({ where: { id: chatId } }),
    ])
    return { success: true, message: `Grupo "${deletedGroup.name}" excluído com sucesso`, data: { deletedMessages: deletedMessages.count, deletedUsers: deletedUsers.count, deletedGroup: deletedGroup.id } }
  }

  async addMember(req: AuthenticatedRequest, member: User, chatId: string ){ 
    const existing = await this.prismaService.chatUser.findUnique( { where: { chat_id_user_id: { chat_id: chatId, user_id: member.id } } } )
    if(existing) throw new BadRequestException(`${member.name} já está no grupo`)
    const newMember = await this.prismaService.chat.update( { where: { id: chatId }, data: { users: { create: { role: 'MEMBER', user_name: member.name, user: { connect: { id: member.id } } } } }, include: { users: true } })
    return { success: true, message: `${req.user.name} adicionou ${member.name} ao grupo`, data: newMember}
  }

  async editMember(req: AuthenticatedRequest, member: User, role: CHAT_ROLE, chatId: string){ 
    const requested = await this.prismaService.chatUser.findUnique({ where: { chat_id_user_id: { chat_id: chatId, user_id: member.id } } } )
    if(requested!.role === 'OWNER') throw new UnauthorizedException("Não é possível alterar permissões do dono do grupo")
    const updatedMember = await this.prismaService.chatUser.update( { where: { chat_id_user_id: { chat_id: chatId, user_id: member.id } }, data: { role } })
    return { success: true, message: `${req.user.name} atualizou ${member.name} para ${role}`, data: updatedMember}
  }

  async leaveGroup(req: AuthenticatedRequest, chatId: string){ 
    const removedMember = await this.prismaService.chatUser.delete( { where: { chat_id_user_id : { chat_id: chatId, user_id: req.user.id } } } )
    if(removedMember.role === "OWNER"){ 
      const nextOwner = await this.prismaService.chatUser.findFirst({ where: { chat_id: chatId, role: { in: ["ADMIN", "MEMBER"] } }, orderBy: { updatedAt: "asc" } } )
      if(!nextOwner) return this.deleteGroupChat(chatId)
      const promoted = await this.prismaService.chatUser.update({ where: { id: nextOwner.id }, data: { role: 'OWNER' } })
      return { success: true, message: `O dono ${req.user.name} saiu. Novo dono: ${promoted.user_name}`, data: { removedMember, newOwner: promoted } }
    }
    return { success: true, message: `${req.user.name} saiu do grupo`, data: removedMember}
  }

  async removeMember(req: AuthenticatedRequest, chatId: string, member: User){  
    if(req.user.id === member.id) throw new BadRequestException("Use 'sair do grupo' para sair")
    const removedMember = await this.prismaService.chatUser.delete( { where: { chat_id_user_id : { chat_id: chatId, user_id: member.id } } }  )
    return { success: true, message: `${req.user.name} removeu ${member.name} do grupo`, data: removedMember}
  }

  // utils
  encryptMsg(content: string){ 
    return encrypt(content)
  }

  async chatExists(chatId: string){
    const chat = await this.prismaService.chat.findUnique({ where: { id: chatId }, include: { users: true } } )
    if(!chat) throw new NotFoundException('Conversa não encontrada.')
    return chat
  }

  generateMessageHash(chat_id: string, sender_id: string, content: string, createdAt?: Date) {
    if(!createdAt) createdAt = new Date() 
    return crypto.createHash('sha256').update(`${chat_id}:${sender_id}:${content}:${createdAt.toISOString()}`).digest('hex');
  }

}
