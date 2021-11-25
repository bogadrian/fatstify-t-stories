import {
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
  FastifyInstance
} from 'fastify';

import User from '../../models/users';

const forgotPassword: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts
): Promise<void> => {
  fastify.register(import('../../plugins/template'));
  fastify.register(import('../../plugins/sendEmailResetPassword'));

  fastify.post(
    '/forgotPassword',
    async function (req: FastifyRequest, reply: FastifyReply) {
      //extract the email and password from req.body

      const { email } = req.body as {
        email: string;
      };

      // check if an email and a password was provided.if not stop here
      if (!email) {
        throw fastify.httpErrors.createError(400, 'Please provide an email!');
      }

      // find the user for that email
      const user = await User.findOne({ email });
      // check if the password is correct with a schemUser method function

      if (!user) {
        throw fastify.httpErrors.createError(
          404,
          'User with this email not found!'
        );
      }
      await fastify.sendEmailResetPassword(user);

      return { message: 'success' };
    }
  );
};

declare module 'fastify' {
  interface FastifyJWT {
    id: string;
  }
  interface FastifyInstance {
    sendEmailResetPassword: any;
  }
}
export default forgotPassword;
