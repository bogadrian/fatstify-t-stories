import { FastifyPluginAsync, FastifyRequest } from 'fastify';

const createError = require('http-errors');
import User from '../../models/users';

const getMe: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/getMe', async function (request: FastifyRequest, reply) {
    const user = fastify.user;

    return {
      user
    };
  });
};

export default getMe;
