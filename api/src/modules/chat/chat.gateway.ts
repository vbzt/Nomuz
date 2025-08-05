import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "http";
import { Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})


export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{ 

  @WebSocketServer()
  server: Server

  handleConnection(socket: Socket) {
    console.log('New user connected! ID: ', socket.id)
  }

  handleDisconnect(socket: Socket) {
    console.log(`User ${socket.id} disconnected`)
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string){
    console.log('Message received! ', message)
    this.server.emit('message', message)
  }
}