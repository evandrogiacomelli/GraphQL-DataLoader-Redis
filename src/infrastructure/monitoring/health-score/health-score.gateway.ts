import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { HealthScoreService } from './health-score.service';

@WebSocketGateway({ cors: true, namespace: '/health' })
export class HealthScoreGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly healthScoreService: HealthScoreService) {}

  afterInit() {
    console.log('[HealthScoreGateway] WebSocket initialized');

    this.healthScoreService.onHealthScoreUpdate((healthScore) => {
      this.server.emit('health-update', healthScore);
    });
  }
}