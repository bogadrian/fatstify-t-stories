import { FastifyPluginAsync, FastifyRequest } from 'fastify';

const createError = require('http-errors');
import User from '../../models/users';

const getMe: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/getMe', async function (request: FastifyRequest, reply) {
    const { id } = request?.user as { id: string };

    if (!id) {
      throw fastify.httpErrors.createError(403, 'No user found');
    }

    const userRes = await User.findById({ _id: id });

    return {
      userRes
    };
  });
};

export default getMe;
