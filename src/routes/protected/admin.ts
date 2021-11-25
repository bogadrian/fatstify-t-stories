import { FastifyPluginAsync, FastifyRequest } from 'fastify';

const createError = require('http-errors');

const admin: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  //fastify.register(require('fastify-multipart'));

  fastify.post('/admin', async function (request: FastifyRequest, reply) {
    const { role } = request?.user as { role: string };

    //  return createError(703, 'test error!');

    if (role && role !== 'admin') {
      // use createError from http-erros module
      throw fastify.httpErrors.createError(
        403,
        'You do not have permission to perform this action!'
      );
    }

    return {
      role: 'you are an admin and you can do it!',
      testProtected: 'this to test protected',
      body: request.body
    };
  });
};

export default admin;
