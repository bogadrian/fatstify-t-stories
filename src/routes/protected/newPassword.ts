import {
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
  FastifyInstance
} from 'fastify';

import User from '../../models/users';

const newPassword: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts
): Promise<void> => {
  fastify.post(
    '/newPassword',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { password } = request.body as {
        password: string;
      };

      if (!password) {
        throw fastify.httpErrors.createError(
          400,
          'Please provide an email and a new password!'
        );
      }

      const userId = fastify.user._id;

      if (!userId) {
        throw fastify.httpErrors.createError(400, 'No user found!');
      }

      const user = await User.findById(userId).select('+password');

      const resIsSame = await user.correctPassword(password, user.password);

      if (!resIsSame) {
        return false;
      } else {
        return true;
      }
    }
  );
};

declare module 'fastify-jwt' {
  interface FastifyJWT {
    id: string;
  }
}
export default newPassword;
