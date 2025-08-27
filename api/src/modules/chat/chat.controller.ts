import { Body, Controller, Delete, Get, Param, ParseEnumPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChatService } from './chat.service'
import { User } from '@prisma/client';
import { UserExistsPipe } from 'src/common/pipes/user-exists.pipe';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-session.interface';
import { ChatAccessGuard } from 'src/common/guards/chat-access.guard';
import { ParseCUIDPipe } from 'src/common/pipes/parse-cuid.pipe';
import { UpdateGroupDTO } from './dto/update-group.dto';
import { ChatAdminGuard } from 'src/common/guards/chat-admin.guard';
import { CreateGroupDTO } from './dto/create-group.dto';
import { UserService } from '../user/user.service';
import { GroupUsersExistsPipe } from 'src/common/pipes/group-users-exists.pipe';
import { CHAT_ROLE } from 'src/common/enums/chat-role.enum';
import { ParseUppercasePipe } from 'src/common/pipes/parse-uppercase.pipe';




@UseGuards(AuthGuard)
@Controller('chats')
export class ChatController {
  constructor( private readonly chatService: ChatService, private readonly userService: UserService ){} 

  @Get()
  async showAllChats(@Req() req: AuthenticatedRequest){ 
    const user = req.user
    return this.chatService.loadChats(user.id)
  }

  @UseGuards(ChatAccessGuard)
  @Get('/:chatId')
  async getChat( @Param('chatId') chatId: string ){ 
    return this.chatService.readMessages(chatId)
  }

  @Post()
  async createPrivateChat(@Req() req: AuthenticatedRequest, @Body('recipientUserId', ParseCUIDPipe, UserExistsPipe ) recipientUser: User){ 
    return this.chatService.createPrivateChat(req, recipientUser)
  } 

  
  @UseGuards(ChatAccessGuard)
  @Post('/:chatId/messages')
  async sendMsg(@Body('content') content: string, @Param('chatId', ParseCUIDPipe ) chatId: string, @Req() req: AuthenticatedRequest ){ 
    return this.chatService.sendMsg(content, chatId, req.user.id)
  }

  @Post('/groups')
  async createGroup(@Req() req: AuthenticatedRequest,@Body('memberId',ParseCUIDPipe, GroupUsersExistsPipe) members: User[] , @Body() data: CreateGroupDTO){ 
    return this.chatService.createGroupChat(req, members, data)
  }

  

  @UseGuards(ChatAccessGuard, ChatAdminGuard)
  @Patch('/groups/:chatId')
  async updateGroup(@Req() req: AuthenticatedRequest, @Body() data: UpdateGroupDTO, @Param('chatId', ParseCUIDPipe) chatId: string ){ 
    return this.chatService.updateGroupChat(req, data, chatId)
  }


  
  @UseGuards(ChatAccessGuard, ChatAdminGuard)
  @Post('/groups/:chatId/members')
  async addMember( @Req() req: AuthenticatedRequest, @Param('chatId', ParseCUIDPipe) chatId: string, @Body('userId', ParseCUIDPipe, UserExistsPipe) user: User ){ 
    return this.chatService.addMember(req, user, chatId)
  }

  @UseGuards(ChatAccessGuard, ChatAdminGuard)
  @Patch('groups/:chatId/members/:memberId')
  async editMember( @Param('chatId', ParseCUIDPipe) chatId: string, @Param('memberId', ParseCUIDPipe, UserExistsPipe) user: User, @Body('role', ParseUppercasePipe, new ParseEnumPipe(CHAT_ROLE)) role: CHAT_ROLE) {

  }

    
  @UseGuards(ChatAccessGuard)
  @Delete('/groups/:chatId/members/me')
  async leaveGroup(@Req() req: AuthenticatedRequest, @Param('chatId', ParseCUIDPipe ) chatId: string){ 

  }


  @UseGuards(ChatAccessGuard, ChatAdminGuard)
  @Delete('/groups/:chatId/members/:userId')
  async removeMember(
    @Req() req: AuthenticatedRequest, 
    @Param('chatId', ParseCUIDPipe) chatId: string, 
    @Param('userId', ParseCUIDPipe, UserExistsPipe) userId: User ){ 

  }







}
