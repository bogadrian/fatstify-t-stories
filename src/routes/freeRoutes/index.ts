import { FastifyPluginAsync, FastifyRequest } from 'fastify';

const createError = require('http-errors');

const freeRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  //fastify.register(require('fastify-multipart'));

  fastify.get('/', async function (request: FastifyRequest, reply) {
    return {
      role: 'free route'
    };
  });
};

export default freeRoutes;
