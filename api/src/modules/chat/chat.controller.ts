import { Body, Controller, Delete, Get, Param, ParseEnumPipe, Patch, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChatService } from './chat.service';
import { User } from '@prisma/client';
import { UserExistsPipe } from 'src/common/pipes/user-exists.pipe';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-session.interface';
import { ChatAccessGuard } from 'src/common/guards/chat-access.guard';
import { ParseCUIDPipe } from 'src/common/pipes/parse-cuid.pipe';
import { UpdateGroupDTO } from './dto/update-group.dto';
import { ChatAdminGuard } from 'src/common/guards/chat-admin.guard';
import { CreateGroupDTO } from './dto/create-group.dto';
import { GroupUsersExistsPipe } from 'src/common/pipes/group-users-exists.pipe';
import { CHAT_ROLE } from 'src/common/enums/chat-role.enum';
import { ParseUppercasePipe } from 'src/common/pipes/parse-uppercase.pipe';
import { ChatOwnerGuard } from 'src/common/guards/chat-owner.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from '../file/file.service';

@UseGuards(AuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService, private readonly fileService: FileService) {}

  // chats 
  @Get()
  async showAllChats(@Req() req: AuthenticatedRequest) {
    return this.chatService.loadChats(req.user.id)
  }

  @Post()
  async createPrivateChat(
    @Req() req: AuthenticatedRequest,
    @Body('recipientUserId', ParseCUIDPipe, UserExistsPipe) recipientUser: User
  ) {
    return this.chatService.createPrivateChat(req, recipientUser)
  }

  // messages 
  @UseGuards(ChatAccessGuard)
  @Get('/:chatId/')
  async listMessages(@Param('chatId', ParseCUIDPipe) chatId: string) {
    return this.chatService.readMessages(chatId)
  }

  @UseGuards(ChatAccessGuard)
  @UseInterceptors(FilesInterceptor('files', 10, { limits: { fileSize: 64 * 1024 * 1024 } }))
  @Post('/:chatId/messages')
  async sendMsg(
    @Body('content') content: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('chatId', ParseCUIDPipe) chatId: string,
    @Req() req: AuthenticatedRequest
  ) {
    const fileMetas = files?.length
      ? await this.fileService.uploadMany(files)
      : [];

    return this.chatService.sendMsg(content, chatId, req.user.id, fileMetas);
  }
  // group chats
  @Post('/groups')
  async createGroup(
    @Req() req: AuthenticatedRequest,
    @Body('memberId', ParseCUIDPipe, GroupUsersExistsPipe) members: User[],
    @Body() data: CreateGroupDTO
  ) {
    return this.chatService.createGroupChat(req, members, data)
  }

  @UseGuards(ChatAccessGuard, ChatAdminGuard)
  @Patch('/:chatId')
  async updateGroup(
    @Req() req: AuthenticatedRequest,
    @Param('chatId', ParseCUIDPipe) chatId: string,
    @Body() data: UpdateGroupDTO
  ) {
    return this.chatService.updateGroupChat(req, data, chatId)
  }

  @UseGuards(ChatAccessGuard, ChatOwnerGuard)
  @Delete('/:chatId')
  async deleteGroup(@Param('chatId', ParseCUIDPipe) chatId: string) {
    return this.chatService.deleteGroupChat(chatId)
  }

  // members 
  @UseGuards(ChatAccessGuard)
  @Get('/:chatId/members')
  async getMembers(
    @Param("chatId", ParseCUIDPipe) chatId: string
  ){
    return this.chatService.getMembers(chatId)
  }

  @UseGuards(ChatAccessGuard, ChatAdminGuard)
  @Post('/:chatId/members')
  async addMember(
    @Req() req: AuthenticatedRequest,
    @Param('chatId', ParseCUIDPipe) chatId: string,
    @Body('userId', ParseCUIDPipe, UserExistsPipe) member: User
  ) {
    return this.chatService.addMember(req, member, chatId)
  }

  @UseGuards(ChatAccessGuard, ChatAdminGuard)
  @Patch('/:chatId/members/:memberId')
  async editMember(
    @Req() req: AuthenticatedRequest,
    @Param('chatId', ParseCUIDPipe) chatId: string,
    @Param('memberId', ParseCUIDPipe, UserExistsPipe) member: User,
    @Body('role', ParseUppercasePipe, new ParseEnumPipe(CHAT_ROLE)) role: CHAT_ROLE
  ) {
    return this.chatService.editMember(req, member, role, chatId)
  }

  @UseGuards(ChatAccessGuard)
  @Delete('/:chatId/members/me')
  async leaveGroup(@Req() req: AuthenticatedRequest, @Param('chatId', ParseCUIDPipe) chatId: string) {
    return this.chatService.leaveGroup(req, chatId)
  }

  @UseGuards(ChatAccessGuard, ChatAdminGuard)
  @Delete('/:chatId/members/:memberId')
  async removeMember(
    @Req() req: AuthenticatedRequest,
    @Param('chatId', ParseCUIDPipe) chatId: string,
    @Param('memberId', ParseCUIDPipe, UserExistsPipe) member: User
  ) {
    return this.chatService.removeMember(req, chatId, member)
  }
}
