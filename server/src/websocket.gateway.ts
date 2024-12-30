import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WorkspaceGetway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('folderUpdate')
  handleFolderUpdate(client: Socket, payload: any) {
    client.broadcast.emit('folderUpdated', payload);
  }

  @SubscribeMessage('joinWorkspace')
  handleJoinWorkspace(client: Socket, workspaceId: string) {
    client.join(`workspace-${workspaceId}`);
  }
}
