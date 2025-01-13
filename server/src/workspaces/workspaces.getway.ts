import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  namespace: 'workspaces',
})
export class WorkspacesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('WorkspacesGateway');
  private userRooms: Map<string, string> = new Map();

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Join a default room or user-specific room
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(`user-${userId}`);
      this.userRooms.set(client.id, `user-${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const room = this.userRooms.get(client.id);
    if (room) {
      client.leave(room);
      this.userRooms.delete(client.id);
    }
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user-${userId}`).emit(event, data);
  }

  @SubscribeMessage('createWorkspace')
  handleWorkspaceCreated(client: Socket, payload: any) {
    const userId = client.handshake.query.userId as string;
    this.emitToUser(userId, 'onProjectCreated', payload);
  }

  @SubscribeMessage('updateWorkspace')
  handleWorkspaceUpdated(client: Socket, payload: any) {
    const userId = client.handshake.query.userId as string;
    this.emitToUser(userId, 'onProjectUpdated', payload);
  }

  @SubscribeMessage('deleteWorkspace')
  handleWorkspaceDeleted(client: Socket, payload: any) {
    const userId = client.handshake.query.userId as string;
    this.emitToUser(userId, 'onProjectDeleted', payload);
  }
}
