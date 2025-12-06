import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';


@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>(); // userId -> socketId

  handleConnection(client: any) {
    console.log("Client connecté :", client.id);
  }

  handleDisconnect(client: any) {
    for (let [userId, socketId] of this.users.entries()) {
      if (socketId === client.id) this.users.delete(userId);
    }
  }

  @SubscribeMessage("register")
  handleRegister(client: any, userId: string) {
    this.users.set(userId, client.id);
  }

  emitToUser(userId: string, data: any) {
    const socketId = this.users.get(userId);
    if (socketId) {
      this.server.to(socketId).emit("notification", data);
      return true; // utilisateur en ligne
    }
    return false; // utilisateur hors ligne
  }
}
