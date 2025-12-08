import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets';
import { log } from 'console';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CarpoolGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;

    console.log("✅ Socket connecté, userId =", userId);

    if (userId) {
      client.join(`user_${userId}`);
      console.log(`✅ User ${userId} ajouté dans room user_${userId}`);
    }
  }

  notifyUser(userId: number, event: string, data: any) {
    console.log("📤 Envoi socket vers :", `user_${userId}`, event, data);

    this.server
      .to(`user_${userId}`)
      .emit(event, data);
  }
}
