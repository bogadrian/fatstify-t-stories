import {
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
  FastifyInstance
} from 'fastify';

import User from '../../models/users';

import * as jwtoken from 'jsonwebtoken';

const refresh: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts
): Promise<void> => {
  fastify.register(require('fastify-jwt'), {
    secret: process.env.SECRET_REFRESH_TOKEN!
  });
  fastify.get(
    '/refresh',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const decoded = await request.jwtVerify();

      const { id } = decoded as { id: string };
      const userRes = await User.findById({ _id: id });

      if (!userRes) {
        throw fastify.httpErrors.createError(
          404,
          'The user was not found in the list of users!'
        );
      }

      const token = jwtoken.sign(
        { user: userRes._id, issuedDate: Date.now() },
        process.env.SECRET_ACCESS_TOKEN!,
        {
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
        }
      );

      if (!token) {
        throw fastify.httpErrors.createError(
          404,
          'The user was an error with the acess token realease!'
        );
      }

      return { token };
    }
  );
};

export default refresh;
