import { FastifyPluginAsync, FastifyRequest } from 'fastify';

const createError = require('http-errors');

const signOut: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/signOut', async function (request: FastifyRequest, reply) {
    return 'success';
  });
};

export default signOut;
