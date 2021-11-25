import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // register routes unprotected here

  fastify.get('/', async function (request, reply) {
    return { root: true };
  });
};

export default root;
