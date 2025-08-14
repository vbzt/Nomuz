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


export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{ 

  constructor ( private readonly authService: AuthService, private readonly chatService: ChatService){}

  @WebSocketServer()
  server: Server

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
    console.log('User connected:', userPayload.name);
  } catch {
    socket.disconnect(true);
  }
  }

  @SubscribeMessage('joinChat')
  handleJoin(socket: Socket, chatId: string){
    socket.join(chatId)
  }

  handleDisconnect(socket: Socket) {
    console.log(`User ${socket.id} disconnected`)
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(socket: Socket, data: { id: string, content: string} ){ 
    const user = socket.data.user
    if(!user) return 
  console.log(data)
    const savedMessage = await this.chatService.sendMsg(data.content, data.id, user.id)
   
    this.server.in(data.id).emit('message', savedMessage)
  }
  
}