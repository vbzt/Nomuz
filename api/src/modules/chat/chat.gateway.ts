import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import * as cookie from 'cookie';
import { AuthService } from "../auth/auth.service";
import { ChatService } from "./chat.service";

@WebSocketGateway(3005, {
  cors: {
    origin: '*',
    credentials: true
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect { 
  constructor(
    private readonly authService: AuthService, 
    private readonly chatService: ChatService
  ){}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    const cookieHeader = socket.handshake.headers.cookie || '';
    const cookies = cookie.parse(cookieHeader);
    const token = cookies.jwt;
    
    if (!token) {
      socket.disconnect(true);
      return;
    }

    try {
      const userPayload = this.authService.checkToken(token);
      socket.data.user = userPayload;  
    } catch {
      socket.disconnect(true);
    }
  }

  handleDisconnect(socket: Socket) {
  }

  @SubscribeMessage('joinChat')
  handleJoin(socket: Socket, chatId: string){
    socket.join(chatId);
  }

  @SubscribeMessage("sendMessage")
  async handleMessage(
    socket: Socket,
    data: { id: string; content: string; files?: any[] }
  ) {
    const user = socket.data.user;
    if (!user) return;

    // salva a mensagem no banco 
    const savedMessage = await this.chatService.sendMsg(
      data.content,
      data.id,
      user.id,
      data.files // se vier do frontend
    );

    // envia para todos os usuários no chat
    this.server.in(data.id).emit("message", savedMessage);
  }

  @SubscribeMessage('readMessage')
  async handleRead(socket: Socket, data: { chatId: string; messageId: string }) {
    const user = socket.data.user;
    if (!user) return;
  
    // marca a mensagem como lida para o usuário
    await this.chatService.markMessageAsRead(data.messageId, user.id);
  
    // notifica somente o usuário que leu (ou todos, mas com userId incluído)
    this.server.in(data.chatId).emit('message.read', {
      messageId: data.messageId,
      userId: user.id
    });
  }
  
}
