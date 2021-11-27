import {
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
  FastifyInstance
} from 'fastify';

import User from '../../models/users';
import * as jwtoken from 'jsonwebtoken';

const resetPassword: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts
): Promise<void> => {
  fastify.register(import('../../plugins/template'));

  fastify.post(
    '/resetPassword',
    async function (req: FastifyRequest, reply: FastifyReply) {
      const { password: newPassword, token } = req.body as {
        password: string;
        token: string;
      };

      // check if an email and a password was provided.if not stop here
      if (!newPassword || !token) {
        throw fastify.httpErrors.createError(400, 'Please provide an email!');
      }

      const decoded = jwtoken.verify(
        token,
        process.env.SECRET_FORGOT_PASSWORD!
      ) as {
        user: string;
        exp: number;
      };

      const { user } = decoded;

      const userExists = await User.findById({ _id: user });

      const passwordHashed = await userExists.hashPasswordReset(newPassword);

      const updatedUser = await User.updateOne(
        { _id: userExists._id },
        {
          $set: {
            password: passwordHashed
          },
          $addToSet: { exPasswords: passwordHashed }
        },
        { upsert: true, new: true },
        (error: Error, doc: any) => {
          if (error) {
            throw fastify.httpErrors.createError(
              403,
              'We cannot verify your email! Please try agian later!'
            );
          }
        }
      );

      if (!updatedUser) {
        throw fastify.httpErrors.createError(
          403,
          'We cannot verify your email! Please try agian later!'
        );
      }

      return { user: updatedUser };
    }
  );
};

declare module 'fastify-jwt' {
  interface FastifyJWT {
    id: string;
  }
}
export default resetPassword;
