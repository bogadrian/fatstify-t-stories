import { FastifyPluginAsync } from 'fastify';

import getMe from '../user/getMe';
import uploadUserPhoto from './uploadUserPhoto';
import getUserPhoto from './getUserPhoto';

const user: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.register(getMe);
  fastify.register(uploadUserPhoto);
  fastify.register(getUserPhoto);
};

export default user;

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: () => void;
    www: string;
  }
  export interface FastifyRequest {
    file: any;
  }
}
