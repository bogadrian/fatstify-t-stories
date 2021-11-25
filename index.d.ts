import fastify, { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

declare module 'fastify' {
  export interface FastifyInstanceAugmented<
    FastifyInstance,
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    ref: () => Promise<ServerResponse>;
  }
}
