import { FastifyPluginAsync } from 'fastify';

import admin from './admin';
import getMe from './getMe';

const protect: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // the 'onRequest' hook checks if the user is authenticated. if it is not, the code stops here. if it is, the routes registred below can be reached.

  fastify.addHook('onRequest', fastify.authenticate);

  // register any routes protected here

  // you can use the prevalidation hook in here (if you weren't using the 'onRequest' hook here up)

  fastify.register(admin);
  fastify.register(getMe);
};

export default protect;

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: () => void;
    www: string;
  }
  export interface FastifyRequest {
    file: any;
  }
}
