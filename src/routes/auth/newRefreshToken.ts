import {
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
  FastifyInstance
} from 'fastify';

import User from '../../models/users';

const newRefreshToken: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts
): Promise<void> => {
  fastify.register(require('fastify-jwt'), {
    secret: process.env.SECRET_REFRESH_TOKEN!
  });
  fastify.get(
    '/newRefreshToken',
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

      const refreshToken = fastify.jwt.sign(
        { id: userRes._id },
        {
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
        }
      );

      if (!refreshToken) {
        throw fastify.httpErrors.createError(
          404,
          'The user was an error with the acess token realease!'
        );
      }

      return { refreshToken };
    }
  );
};

export default newRefreshToken;
