import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:1127', 'http://192.168.0.100:1127'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class BlogPublishGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(BlogPublishGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Socket connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket disconnected: ${client.id}`);
  }

  emitBlogUpdated(blog: unknown) {
    this.server.emit('blogUpdated', blog);
  }

  emitBlogPublished(blog: unknown) {
    this.server.emit('blogPublished', blog);
  }
}
