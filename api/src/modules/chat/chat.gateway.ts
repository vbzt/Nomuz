import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "http";
import { Socket } from "socket.io";
import * as cookie from 'cookie';
import { AuthService } from "../auth/auth.service";

@WebSocketGateway(3005, {
  
  cors: {
    origin: '*',
    credentials: true
  },

})


export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{ 

  constructor ( private readonly authService: AuthService){}

  @WebSocketServer()
  server: Server

 handleConnection(socket: Socket) {
  const cookieHeader = socket.handshake.headers.cookie || '';
  const cookies = cookie.parse(cookieHeader);
  const jwtString = cookies.jwt;
  if(!jwtString) return
  const jsonString = jwtString.slice(2);
  const jwtObject = JSON.parse(jsonString);
  const token = jwtObject.JWTtoken;

  if (!token) {
    socket.disconnect(true);
    return;
  }

  try {
    const userPayload = this.authService.checkToken(token);
    socket.data.user = userPayload;  // guarda os dados do usuário na conexão
    console.log('User connected:', userPayload.name);
  } catch {
    socket.disconnect(true);
  }
}

  handleDisconnect(socket: Socket) {
    console.log(`User ${socket.id} disconnected`)
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: any){
    const userName = client.data.user?.name || 'anon'
    const msg = {
      name: userName,
      text: message,
    };
    this.server.emit('message', msg)
  }
}