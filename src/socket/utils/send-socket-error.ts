// src/socket/utils/send-socket-error.ts
import { Socket } from 'socket.io';
import { ServerToClientEvents, SocketErrorPayload, SocketErrorSlug } from '../room-types.js';

export function sendSocketError(socket: Socket, slug: SocketErrorSlug, message: string) {
  const payload: SocketErrorPayload = { slug, message };
  socket.emit(ServerToClientEvents.ERROR, payload);
}
