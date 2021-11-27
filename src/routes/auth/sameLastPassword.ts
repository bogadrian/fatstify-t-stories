import {
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
  FastifyInstance
} from 'fastify';

import User from '../../models/users';
import * as jwtoken from 'jsonwebtoken';

const sameLastPassword: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts
): Promise<void> => {
  fastify.post(
    '/samePassword',
    async function (request: FastifyRequest, reply: FastifyReply) {
      //extract the email and password from req.body

      const { password, token } = request.body as {
        password: string;
        token: string;
      };

      if (!token || !password) {
        throw fastify.httpErrors.createError(
          400,
          'Please provide an email and a new password!'
        );
      }

      const { user: userId } = jwtoken.verify(
        token,
        process.env.SECRET_FORGOT_PASSWORD
      ) as { user: string };

      if (!userId) {
        throw fastify.httpErrors.createError(400, 'No user found!');
      }

      // find the user for that email
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
export default sameLastPassword;
